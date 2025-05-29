import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5002/api/tasks';

// Sample meeting transcript
const transcript = `
Aman you take the landing page by 10pm tomorrow. 
Rajeev you take care of client follow-up by Wednesday. 
Shreya please review the marketing deck tonight.
`;

// Test the transcript parsing endpoint
async function testTranscriptParsing() {
  console.log('Testing transcript parsing...');
  try {
    console.log('Sending request to:', `${API_URL}/transcript/parse`);
    console.log('Request payload:', { transcript });
    const response = await axios.post(`${API_URL}/transcript/parse`, { transcript });
    console.log('Parsed tasks:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error parsing transcript:', axiosError.response?.data || axiosError.message);
    console.error('Full error:', axiosError);
    return null;
  }
}

// Test creating tasks from a transcript
async function testTranscriptProcessing() {
  console.log('\nTesting transcript processing and task creation...');
  try {
    console.log('Sending request to:', `${API_URL}/transcript`);
    console.log('Request payload:', { transcript });
    const response = await axios.post(`${API_URL}/transcript`, { transcript });
    console.log('Created tasks:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error processing transcript:', axiosError.response?.data || axiosError.message);
    console.error('Full error:', axiosError);
    return null;
  }
}

// Run the tests
async function runTests() {
  // First parse the transcript without saving
  await testTranscriptParsing();
  
  // Then process the transcript and create tasks
  await testTranscriptProcessing();
  
  console.log('\nTests completed!');
}

runTests();
