## Improvement ##

### Budget Planning ###
User can set budgets for different categories and track their spending against these limits. For example, user can set a monthly limit on food & beverage costs to avoid overspending in one month. This will help users manage money more effectively and ensure they are spending within their budgets.

Technical Implementation Idea:

1. Use `categoryBudget` table to store user configuration of the budgets.
2. When user want to check weekly report or chart, sum up the spending for that week and against it to `categoryBudget` amount.

### Reporting ###
User can generate reports summarizing their income, expenses, and savings over specific periods. This will help users understand where they are in financial health by providing a snapshot of the current situation at any given time.

Technical Implementation Idea:

1. Use `transaction` table to store all income, expense, and saving records with timestamp.
2. When user want to check out the "Incomes & Expenses Report for last month", they can simply sum up incomes and expneses for that period from transaction records.

### Goal Savings ###
User should be able track their savings goals.

Technical Implementation Idea:

1. Suggest reuse `category` and `categoryLimit` table to handle saving goal.
2. When user creating a saving goal, will create a new saving category and set GOAL category limit.
    ```
    Category {
        id: '1',
        type: SAVING,
        name: 'Japan Travel Fund',
        description: 'Saving for Japan trip in next month.',
    }
    CategoryLimit {
        categoryId: '1',
        type: GOAL,
        amount: '5000.00'
    }    
    ```
3. When user want to save money for his goal.
    ```
    Transaction {
        categoryId: '1',
        type : SAVING,
        description: 'Saved $200 in Japan Travel Fund this month.' ,
        amount : '200.00',
        date: 'TODAY DATE',
    }
    ```

### Wise Platform integration ###
It will help user to record expense and income automatically.

### Multi-currencies Support ###
Support for multiple currences.