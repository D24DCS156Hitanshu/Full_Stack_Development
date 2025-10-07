// Utility functions for localStorage
function getElectionName() {
  return localStorage.getItem('electionName') || 'General Election';
}
function setElectionName(name) {
  localStorage.setItem('electionName', name);
}
function getCandidates() {
  return JSON.parse(localStorage.getItem('candidates') || '[]');
}
function setCandidates(candidates) {
  localStorage.setItem('candidates', JSON.stringify(candidates));
}
function getVotes() {
  return JSON.parse(localStorage.getItem('votes') || '{}');
}
function setVotes(votes) {
  localStorage.setItem('votes', JSON.stringify(votes));
}
function resetVotes() {
  const candidates = getCandidates();
  const votes = {};
  candidates.forEach(c => votes[c] = 0);
  setVotes(votes);
  // Also clear allVotes and votedVoters
  setAllVotes([]);
  setVotedVoters([]);
}
function getAllVotes() {
  return JSON.parse(localStorage.getItem('allVotes') || '[]');
}
function setAllVotes(allVotes) {
  localStorage.setItem('allVotes', JSON.stringify(allVotes));
}
function getVotedVoters() {
  return JSON.parse(localStorage.getItem('votedVoters') || '[]');
}
function setVotedVoters(voters) {
  localStorage.setItem('votedVoters', JSON.stringify(voters));
}

// DOM Elements
const electionNameInput = document.getElementById('electionName');
const saveElectionNameBtn = document.getElementById('saveElectionName');
const candidateInput = document.getElementById('candidateInput');
const addCandidateBtn = document.getElementById('addCandidate');
const candidatesList = document.getElementById('candidatesList');
const votesTable = document.getElementById('votesTable').querySelector('tbody');
const resetVotesBtn = document.getElementById('resetVotes');
const toast = document.getElementById('toast');
const allVotesTable = document.getElementById('allVotesTable').querySelector('tbody');

// Initial Render
function renderElectionName() {
  electionNameInput.value = getElectionName();
}
function renderCandidates() {
  const candidates = getCandidates();
  candidatesList.innerHTML = '';
  candidates.forEach((candidate, idx) => {
    const div = document.createElement('div');
    div.className = 'candidate-item';
    div.innerHTML = `
      <span>${candidate}</span>
      <span class="candidate-actions">
        <button class="add-btn" onclick="editCandidate(${idx})">Edit</button>
        <button class="reset-btn" onclick="deleteCandidate(${idx})">Delete</button>
      </span>
    `;
    candidatesList.appendChild(div);
  });
}
function renderVotes() {
  const votes = getVotes();
  const candidates = getCandidates();
  votesTable.innerHTML = '';
  candidates.forEach(candidate => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${candidate}</td><td>${votes[candidate] || 0}</td>`;
    votesTable.appendChild(tr);
  });
}
function renderAllVotes() {
  const allVotes = getAllVotes();
  allVotesTable.innerHTML = '';
  if (allVotes.length === 0) {
    allVotesTable.innerHTML = '<tr><td colspan="2" style="color:#888;text-align:center;">No votes yet.</td></tr>';
    return;
  }
  allVotes.forEach(vote => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${vote.voter}</td><td>${vote.candidate}</td>`;
    allVotesTable.appendChild(tr);
  });
}

// Add/Edit/Delete Candidates
addCandidateBtn.onclick = () => {
  const name = candidateInput.value.trim();
  if (!name) return showToast('Candidate name required');
  let candidates = getCandidates();
  if (candidates.includes(name)) return showToast('Candidate already exists');
  candidates.push(name);
  setCandidates(candidates);
  // Add to votes
  const votes = getVotes();
  votes[name] = 0;
  setVotes(votes);
  candidateInput.value = '';
  renderCandidates();
  renderVotes();
  showToast('Candidate added');
};

window.editCandidate = function(idx) {
  const candidates = getCandidates();
  const oldName = candidates[idx];
  const newName = prompt('Edit candidate name:', oldName);
  if (!newName || newName.trim() === '' || newName === oldName) return;
  if (candidates.includes(newName)) return showToast('Candidate already exists');
  // Update candidate name
  candidates[idx] = newName;
  // Update votes
  const votes = getVotes();
  votes[newName] = votes[oldName] || 0;
  delete votes[oldName];
  setCandidates(candidates);
  setVotes(votes);
  renderCandidates();
  renderVotes();
  renderAllVotes();
  showToast('Candidate updated');
};

window.deleteCandidate = function(idx) {
  let candidates = getCandidates();
  const name = candidates[idx];
  if (!confirm(`Delete candidate "${name}"?`)) return;
  candidates.splice(idx, 1);
  setCandidates(candidates);
  // Remove from votes
  const votes = getVotes();
  delete votes[name];
  setVotes(votes);
  // Remove from allVotes
  let allVotes = getAllVotes();
  allVotes = allVotes.filter(vote => vote.candidate !== name);
  setAllVotes(allVotes);
  renderCandidates();
  renderVotes();
  renderAllVotes();
  showToast('Candidate deleted');
};

// Save Election Name
saveElectionNameBtn.onclick = () => {
  const name = electionNameInput.value.trim();
  if (!name) return showToast('Election name required');
  setElectionName(name);
  showToast('Election name saved');
};

// Reset Votes
resetVotesBtn.onclick = () => {
  if (!confirm('Reset all votes to zero?')) return;
  resetVotes();
  renderVotes();
  renderAllVotes();
  showToast('All votes reset');
};

// Toast
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Initial load
renderElectionName();
renderCandidates();
renderVotes();
renderAllVotes();
