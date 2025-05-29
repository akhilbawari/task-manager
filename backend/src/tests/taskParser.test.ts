import TaskParserService from '../services/TaskParserService';

// Sample tasks to test
const testCases = [
  {
    input: "Finish landing page Aman by 11pm 20th June",
    expected: {
      name: "Finish landing page",
      assignee: "Aman",
      hasDueDate: true,
      priority: "P3"
    }
  },
  {
    input: "Call client Rajeev tomorrow 5pm",
    expected: {
      name: "Call client",
      assignee: "Rajeev",
      hasDueDate: true,
      priority: "P3"
    }
  },
  {
    input: "Submit report P1 by Friday",
    expected: {
      name: "Submit report",
      assignee: null,
      hasDueDate: true,
      priority: "P1"
    }
  },
  {
    input: "Review design mockups P2",
    expected: {
      name: "Review design mockups",
      assignee: null,
      hasDueDate: false,
      priority: "P2"
    }
  }
];

// Run tests
console.log("Testing TaskParserService...\n");

testCases.forEach((testCase, index) => {
  console.log(`Test Case ${index + 1}: "${testCase.input}"`);
  
  const result = TaskParserService.parseTask(testCase.input);
  
  console.log("Parsed Result:");
  console.log(`- Task: "${result.name}"`);
  console.log(`- Assignee: ${result.assignee || "None"}`);
  console.log(`- Due Date: ${result.dueDate ? result.dueDate.toLocaleString() : "None"}`);
  console.log(`- Priority: ${result.priority}`);
  
  // Simple validation
  const validation = {
    name: result.name === testCase.expected.name,
    assignee: testCase.expected.assignee === null ? result.assignee === null : result.assignee === testCase.expected.assignee,
    dueDate: (result.dueDate !== null) === testCase.expected.hasDueDate,
    priority: result.priority === testCase.expected.priority
  };
  
  console.log("\nValidation:");
  console.log(`- Task Name: ${validation.name ? "✓" : "✗"}`);
  console.log(`- Assignee: ${validation.assignee ? "✓" : "✗"}`);
  console.log(`- Due Date: ${validation.dueDate ? "✓" : "✗"}`);
  console.log(`- Priority: ${validation.priority ? "✓" : "✗"}`);
  
  const passed = Object.values(validation).every(v => v);
  console.log(`\nOverall: ${passed ? "PASSED ✓" : "FAILED ✗"}`);
  console.log("----------------------------------------\n");
});
