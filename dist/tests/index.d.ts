/**
 * Main test suite entry point.
 * Runs all tests and provides a unified testing interface.
 */
/**
 * Runs all test suites and reports results.
 * @returns True if all tests pass, false otherwise
 */
export declare function runAllTests(): Promise<boolean>;
/**
 * Runs a specific test suite by name.
 * @param testName The name of the test suite to run
 * @returns True if the test suite passes, false otherwise
 */
export declare function runTest(testName: string): Promise<boolean>;
/**
 * Runs tests with detailed output and performance metrics.
 * @returns Test results with performance data
 */
export declare function runTestsWithMetrics(): {
    passed: boolean;
    results: {
        name: string;
        passed: boolean;
        duration: number;
    }[];
    totalDuration: number;
};
