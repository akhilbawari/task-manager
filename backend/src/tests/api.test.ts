/**
 * API Testing Script
 * 
 * This script tests the Task Manager API endpoints.
 * Run with: npx ts-node src/tests/api.test.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tasks';

// Sample tasks for testing
const testTasks = [
  "Finish landing page Aman by 11pm 20th June",
  "Call client Rajeev tomorrow 5pm",
  "Submit report P1 by Friday",
  "Review design mockups P2"
];

// Store created task IDs
const createdTaskIds: string[] = [];

// Test functions
async function testParseEndpoint() {
  console.log('\n🔍 Testing Parse Endpoint...');
  
  try {
    const response = await axios.post(`${API_URL}/parse`, {
      taskString: testTasks[0]
    });
    
    console.log('✅ Parse Endpoint Result:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error: any) {
    console.error('❌ Parse Endpoint Error:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateTask() {
  console.log('\n📝 Testing Create Task Endpoint...');
  
  try {
    for (const task of testTasks) {
      const response = await axios.post(API_URL, {
        taskString: task
      });
      
      console.log(`✅ Created Task: "${task}"`);
      createdTaskIds.push(response.data.data._id);
    }
    
    console.log(`Created ${createdTaskIds.length} tasks successfully`);
    return true;
  } catch (error: any) {
    console.error('❌ Create Task Error:', error.response?.data || error.message);
    return false;
  }
}

async function testGetAllTasks() {
  console.log('\n📋 Testing Get All Tasks Endpoint...');
  
  try {
    const response = await axios.get(API_URL);
    
    console.log(`✅ Retrieved ${response.data.count} tasks`);
    console.log('Tasks:');
    response.data.data.forEach((task: any, index: number) => {
      console.log(`${index + 1}. ${task.name} - Assigned to: ${task.assignee}, Due: ${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'None'}, Priority: ${task.priority}`);
    });
    
    return true;
  } catch (error: any) {
    console.error('❌ Get All Tasks Error:', error.response?.data || error.message);
    return false;
  }
}

async function testGetSingleTask() {
  if (createdTaskIds.length === 0) {
    console.log('\n⚠️ No tasks created to test Get Single Task');
    return false;
  }
  
  console.log('\n🔎 Testing Get Single Task Endpoint...');
  
  try {
    const taskId = createdTaskIds[0];
    const response = await axios.get(`${API_URL}/${taskId}`);
    
    console.log('✅ Retrieved Task:');
    console.log(JSON.stringify(response.data.data, null, 2));
    
    return true;
  } catch (error: any) {
    console.error('❌ Get Single Task Error:', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateTask() {
  if (createdTaskIds.length === 0) {
    console.log('\n⚠️ No tasks created to test Update Task');
    return false;
  }
  
  console.log('\n✏️ Testing Update Task Endpoint...');
  
  try {
    const taskId = createdTaskIds[0];
    const response = await axios.put(`${API_URL}/${taskId}`, {
      name: 'Updated Task Name',
      priority: 'P1'
    });
    
    console.log('✅ Updated Task:');
    console.log(JSON.stringify(response.data.data, null, 2));
    
    return true;
  } catch (error: any) {
    console.error('❌ Update Task Error:', error.response?.data || error.message);
    return false;
  }
}

async function testDeleteTask() {
  if (createdTaskIds.length === 0) {
    console.log('\n⚠️ No tasks created to test Delete Task');
    return false;
  }
  
  console.log('\n🗑️ Testing Delete Task Endpoint...');
  
  try {
    // Delete the last task
    const taskId = createdTaskIds.pop();
    await axios.delete(`${API_URL}/${taskId}`);
    
    console.log(`✅ Deleted Task with ID: ${taskId}`);
    
    return true;
  } catch (error: any) {
    console.error('❌ Delete Task Error:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('API URL:', API_URL);
  
  const testResults = {
    parse: await testParseEndpoint(),
    create: await testCreateTask(),
    getAll: await testGetAllTasks(),
    getSingle: await testGetSingleTask(),
    update: await testUpdateTask(),
    delete: await testDeleteTask()
  };
  
  console.log('\n📊 Test Results Summary:');
  Object.entries(testResults).forEach(([test, result]) => {
    console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'Passed' : 'Failed'}`);
  });
  
  const allPassed = Object.values(testResults).every(result => result);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '❌ Some tests failed.'}`);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
