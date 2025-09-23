### E2E Testing Pipeline with Cypress and GitHub Actions 🧪

This project demonstrates a robust end-to-end (E2E) testing pipeline using **Cypress**, integrated with **GitHub Actions** for continuous integration. The pipeline automatically runs tests on every push to the `master` branch, generates a detailed test report with Mochawesome, and makes it available as a downloadable artifact.

-----

### 1\. Project Setup 🚀

To get started with this project, follow these steps to set up the testing environment.

1.  **Initialize npm**: Navigate to your project directory in the terminal and run the following command to create a `package.json` file.

    ```bash
    npm init -y
    ```

2.  **Install Dependencies**: Install Cypress and the Mochawesome reporter and tools.

    ```bash
    npm install cypress mochawesome mochawesome-merge mochawesome-report-generator --save-dev
    ```

3.  **Configure Cypress**: Update your `cypress.config.js` file to use the Mochawesome reporter. This tells Cypress to output test results in a format that Mochawesome can process.

    ```javascript
    const { defineConfig } = require('cypress')

    module.exports = defineConfig({
      e2e: {
        reporter: 'mochawesome',
        reporterOptions: {
          reportDir: 'cypress/results',
          overwrite: false,
          html: false,
          json: true,
        },
      },
    })
    ```

4.  **Create a Test File**: Write your tests in a `.cy.js` file inside the `cypress/e2e` directory. A simple example is shown below.

    ```javascript
    // cypress/e2e/google_search.cy.js

    describe('Google Search Test', () => {
      it('should be able to search for "Cypress"', () => {
        cy.visit('https://www.google.com')
        cy.get('textarea[name="q"]').type('Cypress{enter}')
        cy.title().should('include', 'Cypress')
        cy.contains('https://www.cypress.io').should('be.visible')
      })
    })
    ```

-----

### 2\. GitHub Actions CI/CD Pipeline ⚙️

This project includes a pre-configured GitHub Actions workflow to automate the testing process. The pipeline will:

  - Check out the repository.
  - Install project dependencies.
  - Run the Cypress tests.
  - Generate a single, comprehensive HTML report.
  - Upload the report as a downloadable artifact.

To use it, simply add the following file to your project.

1.  **Create the Workflow File**: Create the directory structure `.github/workflows` and add a new file named `cypress_test.yml`.
2.  **Add the Workflow Code**: Paste the following YAML code into the file. The pipeline is triggered on every `push` or `pull_request` to the `master` branch.
    ```yaml
    name: Cypress E2E Tests

    on:
      push:
        branches:
          - master
      pull_request:
        branches:
          - master

    jobs:
      cypress-run:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v4

          - name: Install dependencies
            run: npm ci

          - name: Run Cypress tests and generate JSON reports
            run: npx cypress run --reporter mochawesome --reporter-options 'reportDir=cypress/results,overwrite=false,html=false,json=true'

          - name: Generate Mochawesome HTML report
            run: |
              mkdir -p mochawesome-report
              npx mochawesome-merge cypress/results/*.json > mochawesome-report/mochawesome-merged.json
              npx mochawesome-report-generator mochawesome-report/mochawesome-merged.json -o mochawesome-report
            if: always()

          - name: Upload Test Results
            if: always()
            uses: actions/upload-artifact@v4
            with:
              name: mochawesome-report
              path: mochawesome-report
              retention-days: 7
    ```
      * **`npm ci`**: Installs your project dependencies. It's similar to `npm install` but more reliable for CI/CD environments.
      * **`mkdir -p mochawesome-report`**: This command creates the `mochawesome-report` directory if it doesn't exist. The `-p` flag prevents an error if the directory already exists.
      * **`npx mochawesome-merge`** and **`npx mochawesome-report-generator`**: These commands process the raw JSON reports from Cypress and create a single, user-friendly HTML report.

-----

### 3\. Git Integration 🚀

To push your project and trigger the pipeline, follow these standard Git steps.

1.  **Initialize Git**: Open your terminal in the project's root and run `git init`.
2.  **Add and Commit Files**: Stage all your files and create the first commit.
    ```bash
    git add .
    git commit -m "Initial E2E pipeline setup"
    ```
3.  **Create a Remote Repository**: Go to GitHub, create a new empty repository, and copy its URL.
4.  **Connect and Push**: Link your local repository to the new remote one and push your code.
    ```bash
    git remote add origin https://github.com/your-username/your-repo-name.git
    git push -u origin master
    ```

Once the push is complete, the workflow will automatically start. You can monitor the progress on the **"Actions"** tab of your GitHub repository.

-----

### 4\. How to View the Report 📊

The final HTML report is stored as a build artifact, which you can download and view.

1.  **Access the Actions Tab**: In your GitHub repository, click on the **"Actions"** tab.
2.  **Select a Workflow Run**: Choose the workflow run you want to review.
3.  **Download the Artifact**: In the run summary, locate the **"Artifacts"** section and click on `mochawesome-report` to download it.
4.  **Open the Report**: Unzip the downloaded file and open the `index.html` file in your browser to see a detailed, visual report of your test results.
