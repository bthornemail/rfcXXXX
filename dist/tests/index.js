/**
 * Main test suite entry point.
 * Runs all tests and provides a unified testing interface.
 */
import { testGeometricConsensus } from './geometric-consensus.test.js';
import { testBettiNumbers } from './betti-numbers.test.js';
import { testIPv6Encoder } from './ipv6-encoder.test.js';
import { testIntegration } from './integration.test.js';
/**
 * Runs all test suites and reports results.
 * @returns True if all tests pass, false otherwise
 */
export async function runAllTests() {
    console.log('🧪 Starting RFC XXXX Test Suite\n');
    let allTestsPassed = true;
    const testResults = [];
    // Run individual test suites
    console.log('Running Geometric Consensus Tests...');
    const consensusPassed = testGeometricConsensus();
    testResults.push({ name: 'Geometric Consensus', passed: consensusPassed });
    allTestsPassed = allTestsPassed && consensusPassed;
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('Running Betti Numbers Tests...');
    const bettiPassed = testBettiNumbers();
    testResults.push({ name: 'Betti Numbers', passed: bettiPassed });
    allTestsPassed = allTestsPassed && bettiPassed;
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('Running IPv6 Encoder Tests...');
    const encoderPassed = testIPv6Encoder();
    testResults.push({ name: 'IPv6 Encoder', passed: encoderPassed });
    allTestsPassed = allTestsPassed && encoderPassed;
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('Running Integration Tests...');
    const integrationPassed = await testIntegration();
    testResults.push({ name: 'Integration', passed: integrationPassed });
    allTestsPassed = allTestsPassed && integrationPassed;
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Suite Summary:');
    console.log('='.repeat(50));
    testResults.forEach(result => {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${result.name}`);
    });
    const passedCount = testResults.filter(r => r.passed).length;
    const totalCount = testResults.length;
    console.log(`\nOverall: ${passedCount}/${totalCount} test suites passed`);
    if (allTestsPassed) {
        console.log('🎉 All tests passed! RFC XXXX implementation is working correctly.');
    }
    else {
        console.log('⚠️  Some tests failed. Please review the implementation.');
    }
    return allTestsPassed;
}
/**
 * Runs a specific test suite by name.
 * @param testName The name of the test suite to run
 * @returns True if the test suite passes, false otherwise
 */
export async function runTest(testName) {
    switch (testName.toLowerCase()) {
        case 'consensus':
        case 'geometric-consensus':
            return testGeometricConsensus();
        case 'betti':
        case 'betti-numbers':
            return testBettiNumbers();
        case 'encoder':
        case 'ipv6-encoder':
            return testIPv6Encoder();
        case 'integration':
            return await testIntegration();
        case 'all':
            return runAllTests();
        default:
            console.error(`Unknown test suite: ${testName}`);
            console.log('Available test suites: consensus, betti, encoder, integration, all');
            return false;
    }
}
/**
 * Runs tests with detailed output and performance metrics.
 * @returns Test results with performance data
 */
export function runTestsWithMetrics() {
    console.log('🧪 Starting RFC XXXX Test Suite with Metrics\n');
    const startTime = Date.now();
    const testResults = [];
    let allTestsPassed = true;
    // Run individual test suites with timing
    const testSuites = [
        { name: 'Geometric Consensus', fn: testGeometricConsensus },
        { name: 'Betti Numbers', fn: testBettiNumbers },
        { name: 'IPv6 Encoder', fn: testIPv6Encoder },
        { name: 'Integration', fn: testIntegration }
    ];
    for (const testSuite of testSuites) {
        console.log(`Running ${testSuite.name} Tests...`);
        const suiteStartTime = Date.now();
        const result = testSuite.fn();
        const duration = Date.now() - suiteStartTime;
        // Handle both sync and async test functions
        if (result instanceof Promise) {
            result.then((passed) => {
                testResults.push({ name: testSuite.name, passed, duration });
                allTestsPassed = allTestsPassed && passed;
            });
        }
        else {
            testResults.push({ name: testSuite.name, passed: result, duration });
            allTestsPassed = allTestsPassed && result;
        }
        console.log(`\n${testSuite.name} completed in ${duration}ms\n`);
        console.log('='.repeat(50) + '\n');
    }
    const totalDuration = Date.now() - startTime;
    // Print detailed summary
    console.log('📊 Detailed Test Suite Summary:');
    console.log('='.repeat(50));
    testResults.forEach(result => {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${result.name} (${result.duration}ms)`);
    });
    const passedCount = testResults.filter(r => r.passed).length;
    const totalCount = testResults.length;
    console.log(`\nOverall: ${passedCount}/${totalCount} test suites passed in ${totalDuration}ms`);
    if (allTestsPassed) {
        console.log('🎉 All tests passed! RFC XXXX implementation is working correctly.');
    }
    else {
        console.log('⚠️  Some tests failed. Please review the implementation.');
    }
    return {
        passed: allTestsPassed,
        results: testResults,
        totalDuration
    };
}
//# sourceMappingURL=index.js.map