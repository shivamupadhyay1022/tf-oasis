import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {  ref, push, onValue, remove } from "firebase/database";
import { useAuth } from '../AuthContext';
import { db } from '../../firebase';
import { supabase } from '../../../supabase';


function countQuestions(questions) {
  if (!questions) return 0;
  return questions.split(',').filter(q => q.trim() !== '').length;
}

const TestRecords = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [assignedTests, setAssignedTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const { id } = useParams(); // user id from URL
  const { userName } = useAuth();

  useEffect(() => {
    const fetchExams = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("id,Name,Duration,Questions");
      if (error) {
        alert(error.message);
      } else {
        setExams(data);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const assignedRef = ref(db, `users/${id}/tests/assigned`);
    const completedRef = ref(db, `users/${id}/tests/completed`);
    
    onValue(assignedRef, (snapshot) => {
      const vals = snapshot.val();
      const arr = [];
      if (vals) {
        Object.entries(vals).forEach(([key, val]) => {
          arr.push({ id: key, ...val });
        });
      }
      setAssignedTests(arr);
    });

    onValue(completedRef, (snapshot) => {
      const vals = snapshot.val();
      const arr = [];
      if (vals) {
        Object.entries(vals).forEach(([key, val]) => {
          arr.push({ id: key, ...val });
        });
      }
      setCompletedTests(arr);
    });

    return () => {};
  }, [id]);

  const handleAssign = (test) => {
    const assignedRef = ref(db, `users/${id}/tests/assigned`);
    const assigned_at = new Date().toISOString();
    // console.log(      test.id,
    //   test.Name,
    //   countQuestions(test.Questions),
    //   assigned_at,
    //    userName)
    push(assignedRef, {
      test_id: test.id,
      name:test.Name,
      no_q:countQuestions(test.Questions),
      duration:test.Duration,
      assigned_at,
      by: userName || 'Unknown'
    });
  };

  const handleDeleteAssigned = (assignedId) => {
    const assignedRef = ref(db, `users/${id}/tests/assigned/${assignedId}`);
    remove(assignedRef);
  };

  function formatDate(dt) {
    if (!dt) return '';
    return new Date(dt).toLocaleString();
  }

  function getExamName(test_id) {
    const exam = exams.find(ex => ex.id === test_id);
    return exam ? exam.Name : '';
  }

  function getExamQuestions(test_id) {
    const exam = exams.find(ex => ex.id === test_id);
    return exam ? countQuestions(exam.Questions) : '';
  }

  // Search and filter exams
  const filteredExams = exams.filter(exam =>
    exam.Name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-10">
      {/* Exams Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Exams</h2>
        <input
          type="text"
          className="mb-3 p-2 border rounded w-full max-w-sm"
          placeholder="Search exams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Duration</th>
                <th className="border px-4 py-2">No. of Questions</th>
                <th className="border px-4 py-2">Assign</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.length === 0 && (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan={5}>No exams found.</td>
                </tr>
              )}
              {filteredExams.slice(0, 5).map(exam => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{exam.id}</td>
                  <td className="border px-4 py-2">{exam.Name}</td>
                  <td className="border px-4 py-2">{exam.Duration}</td>
                  <td className="border px-4 py-2">{countQuestions(exam.Questions)}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800"
                      onClick={() => handleAssign(exam)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
              {/* Show more exams when scrolled */}
              {filteredExams.length > 5 && (
                <tr>
                  <td colSpan={5} className="text-center text-xs py-2 text-gray-500">
                    Scroll down to see more exams
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assigned Tests Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Assigned Tests</h2>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Test ID</th>
              <th className="border px-4 py-2">Exam Name</th>
              <th className="border px-4 py-2">Assigned At</th>
              <th className="border px-4 py-2">By</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {assignedTests.length === 0 && (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan={5}>No tests assigned.</td>
              </tr>
            )}
            {assignedTests.map(test => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{test.test_id}</td>
                <td className="border px-4 py-2">{getExamName(test.test_id)}</td>
                <td className="border px-4 py-2">{formatDate(test.assigned_at)}</td>
                <td className="border px-4 py-2">{test.by}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    title="Delete"
                    onClick={() => handleDeleteAssigned(test.id)}
                    className="text-red-600 hover:text-red-900 text-xl font-bold"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Completed Tests Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Completed Tests</h2>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Test ID</th>
              <th className="border px-4 py-2">Exam Name</th>
              <th className="border px-4 py-2">No. of Questions</th>
              <th className="border px-4 py-2">Attempted At</th>
              <th className="border px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {completedTests.length === 0 && (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan={5}>No tests completed.</td>
              </tr>
            )}
            {completedTests.map(test => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{test.test_id}</td>
                <td className="border px-4 py-2">{getExamName(test.test_id)}</td>
                <td className="border px-4 py-2">{getExamQuestions(test.test_id)}</td>
                <td className="border px-4 py-2">{formatDate(test.attempted_at)}</td>
                <td className="border px-4 py-2">{test.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestRecords;
