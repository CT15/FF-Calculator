# Food Fine Calculator

<p align="center">
  <img width="600" src="https://github.com/CT15/FF-Calculator/blob/master/screen_shots/screen_shot.png">
</p>

A calculator to help myself deal with the food fine collection matters in Anglo-Chinese School (Independent) Boarding School.

The calculator takes care of all the boarders' deposits and debts. The user just needs to key in how many breakfast / lunch / dinner that each boarder skips when fining him, and how much each boarder pays in cash when the boarder is paying off his debt.

## Technology

Framework: electron

Database: NeDB

UI (CSS Framework): Materialize CSS

## Setup Instruction

1. Clone the repository (using HTTPS: `git clone https://github.com/CT15/FF-Calculator.git`)
2. Depending on your OS, run the following from `FF-Calculator` directory:
    * Linux
    ```shell
    $ npm run package-linux
    ```
    * Mac
    ```shell
    $ npm run package-mac
    ```
    * Windows
    ```shell
    $ npm run package-win
    ```
3. Find the application inside the `release-builds` folder and run it

## User Guide

### Set meal prices

1. Go to `Settings` tab
2. Click `EDIT` button
3. Edit the price of breakfast / lunch / dinner
4. Click `DONE` button

### Add new student to deposit list

1. Go to `Deposit` tab
2. Click `+` button
3. Observe that an `Add Student` window appears
4. Fill in all the fields (name and deposit amount)
5. Click `ADD` button

### Edit student in the deposit list

1. Go to `Deposit` tab
2. Click on `EDIT` button beside the student name you want to edit
3. Observe that an `Edit Student` window appears
4. Change necessary field(s)
5. Click `DONE` button

### Fine student

1. Go to `Deposit` tab
2. Click on `FINE` button beside the student name you want to fine
3. Observe that a `Fine Student` window appears
4. Key in the number of breakfast / lunch / dinner that the student skips
5. Click `FINE` button

P.S. If the amount of fine is greater than the student's deposit, you will be able to see the student's debt at the `Debt` tab.

### Pay off debt

1. Go to `Debt` tab
2. Click `PAID` if the student pays the exact amount of money (done), OR
3. Click `PAY` if the student pays more or less than this debt
4. Observe that a `Pay Debt` window appears
5. Key in the amount paid by the student.
5. Click `PAY` button

P.S. If the amount paid is greater than the student's debt, the remaining amount will be added to the student's deposit.

## License

This project is available under the MIT license. See the LICENSE file for more info.

## Reflection

### Reflection 1: Many `ipcMain` is doing the same thing

As there are many renderer windows involved in this program, many of the data is passed arounf using `ipcRenderer` and `ipcMain`. Many of the `ipcMain` end up having the same functionality while listening to different channels. In the future, more strategic naming of the channels can reduce the channels that the `ipcMain` needs to listen to.

### Reflection 2: Overlap in the content of extenal Javascript files in the HTML file

The `mainWindow.html` file contains 3 tabs, and each has its own Javascript file in the HTML file to do processing. An example of duplicates is the initialisation of the `DataSource` object since all 3 tabs require `DataSource` object. My solution for this project is to extract the common modules out into a separate Javascript file. Another way that I can consider is to have separate HTML file for each of the tab. In this way, each initialisation in the Javascript files will not clash as they are contained in different HTML files.
