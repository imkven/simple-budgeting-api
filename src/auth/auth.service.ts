import {
  Logger,
  Injectable,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  User,
  UserStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, LogoutDto, RefreshTokenDto, RegisterDto } from './dto';
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  randomPause,
  verifyPassword,
  TokenPayload,
  secureHash,
} from '../handy/security';
import { date, now } from '../handy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  
  async register({
    username,
    password,
    displayName,
  }: RegisterDto): Promise<{ user: User; }> {
    // Check if the requested username already exists
    const existingUser = await this.prismaService.userPasswordAuth.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new ForbiddenException('Username already exists');
    }

    try {
      return this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            displayName,
            status: UserStatus.ACTIVE,
          },
        });

        const hashedPassword = await hashPassword(password);
        await tx.userPasswordAuth.create({
          data: {
            userId: user.id,
            username,
            password: hashedPassword,
          },
        });

        this.logger.log(`User ${username} registered successfully`);
        return { user };
      });
    } catch (error) {
      this.logger.error(
        `Error registering user`,
        error.stack,
      );

      throw new BadRequestException(error.message);
    }
  }

  /**
   * Authenticates a user by verifying the provided login credentials.
   *
   * @param {LoginDto} loginDto - The login details including username and password.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} The access and refresh tokens upon successful authentication.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; expiresAt: string; refreshToken: string }> {
    const { username, password } = loginDto;

    const userAuth = await this.prismaService.userPasswordAuth.findFirst({
      where: {
        username,
      },
      select: { username: true, password: true, userId: true },
    });
    if (!userAuth) {
      // Security pause to prevent brute force attacks.
      await randomPause();
      throw new ForbiddenException('Invalid credentials');
    }

    // Verify the provided password with the stored hashed password
    if (!(await verifyPassword(userAuth.password, password))) {
      await randomPause();
      throw new ForbiddenException('Invalid credentials');
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: userAuth.userId,
        status: UserStatus.ACTIVE,
      },
      select: { id: true, displayName: true },
    });
    if (!user) {
      await randomPause();
      throw new ForbiddenException('Invalid credentials');
    }

    try {
      const payload = {
        userId: user.id,
      };
      
      const { refreshToken, refreshTokenHash, expiresAt: refreshTokenExpiresAt } = generateRefreshToken(payload);
      const { accessToken, expiresAt } = generateAccessToken({
        ...payload,
        rth: refreshTokenHash,
      });

      this.prismaService.$transaction(async (tx) => {
        // Delete expired refresh tokens
        const existingRefreshTokens = await tx.refreshToken.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            expiresAt: 'desc',
          },
          select: { id: true, expiresAt: true },
        });

        const expiredRefreshTokenIds = existingRefreshTokens
          .filter((rt) => date(rt.expiresAt).isBefore(now()))
          .map(rt => rt.id);

        await tx.refreshToken.deleteMany({
          where: {
            id: { in: expiredRefreshTokenIds },
          },
        });

        const activeRefreshTokens = existingRefreshTokens.filter((rt) => !expiredRefreshTokenIds.includes(rt.id));

        // If the user has more than two active refresh tokens, delete one of them to make room for a new login
        const activeLimit = 2;
        if (activeRefreshTokens.length >= activeLimit) {
          const oldestRefreshTokenIds = activeRefreshTokens.slice(activeLimit - 1, activeRefreshTokens.length).map(rt => rt.id);
          await tx.refreshToken.deleteMany({
            where : {
              id: { in: oldestRefreshTokenIds },
            },
          });
        }
        
        await tx.refreshToken.create({
          data: {
            userId: user.id,
            hash: refreshTokenHash,
            expiresAt: date(refreshTokenExpiresAt).toDate(),
          },
        });
      });

      return { accessToken, expiresAt, refreshToken };
    } catch (error) {
      this.logger.error(
        `Error login user`,
        error.stack,
      );

      throw new BadRequestException(error.message);
    }
  }

  async logout(logoutDto: LogoutDto, tokenPayload: TokenPayload): Promise<{ logout: number }> {
    const { revokeAll } = logoutDto;
    if (revokeAll) {
      const { count } = await this.prismaService.refreshToken.deleteMany({
        where: { userId: tokenPayload.userId },
      });
      return { logout: count };
    } else {
      await this.prismaService.refreshToken.delete({
        where: { hash: tokenPayload.rth },
      })
      return { logout: 1 };
    }
  }

  async refreshToken(
    refreshTokenDto : RefreshTokenDto,
  ): Promise<{ accessToken: string; expiresAt: string; }> {
    const { refreshToken } = refreshTokenDto;
    
    const hashedRefreshToken = await secureHash(refreshToken);

    // Check if the refresh token still exists.
    const existingRefreshTokens = await this.prismaService.refreshToken.findFirst({
      where: {
        hash: hashedRefreshToken,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: { userId : true },
    });
    if (!existingRefreshTokens) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    try {
      const { accessToken, expiresAt } = generateAccessToken({
        userId : existingRefreshTokens.userId,
        rth: hashedRefreshToken,
      });
      return { accessToken, expiresAt };
    } catch (error) {
      this.logger.error('Error refreshing token', error.stack);
      throw new BadRequestException(error.message);
    }
  }
}
