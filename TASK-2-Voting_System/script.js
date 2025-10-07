// Utility functions for localStorage
function getElectionName() {
  return localStorage.getItem('electionName') || 'General Election';
}
function getCandidates() {
  return JSON.parse(localStorage.getItem('candidates') || '[]');
}
function getVotes() {
  return JSON.parse(localStorage.getItem('votes') || '{}');
}
function setVotes(votes) {
  localStorage.setItem('votes', JSON.stringify(votes));
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
const electionTitle = document.getElementById('electionTitle');
const candidatesContainer = document.getElementById('candidatesContainer');
const modal = document.getElementById('voteModal');
const modalText = document.getElementById('modalText');
const closeModal = document.getElementById('closeModal');
const confirmVote = document.getElementById('confirmVote');
const toast = document.getElementById('toast');

let selectedCandidate = null;
let candidateCards = [];
let voterName = null;
let hasVoted = false;

function renderElection() {
  // Set election name
  electionTitle.textContent = getElectionName();
  // Render candidates
  const candidates = getCandidates();
  candidatesContainer.innerHTML = '';
  
  if (candidates.length === 0) {
    candidatesContainer.innerHTML = '<p style="text-align:center;color:#888;padding:2rem;">No candidates available. Please contact admin.</p>';
    return;
  }

  // Add voter status display
  const statusDiv = document.createElement('div');
  statusDiv.id = 'voterStatus';
  statusDiv.style = 'text-align:center;margin-bottom:1.5rem;padding:1rem;border-radius:0.8rem;';
  updateVoterStatus(statusDiv);
  candidatesContainer.appendChild(statusDiv);

  // Minimalist: No total votes display for users
  const candidatesGrid = document.createElement('div');
  candidatesGrid.style = 'display:flex;flex-direction:column;gap:1.5rem;';
  
  candidates.forEach((candidate, i) => {
    const card = document.createElement('div');
    card.className = 'candidate-card';
    card.setAttribute('data-candidate', candidate);
    
    if (hasVoted) {
      card.style.opacity = '0.6';
      card.style.cursor = 'not-allowed';
    }
    
    card.innerHTML = `
      <div class="avatar" style="background: linear-gradient(135deg, ${randomGradient(i)});"></div>
      <div class="candidate-info">
        <span class="candidate-name">${candidate}</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      if (hasVoted) {
        showToast('You have already voted!');
        return;
      }
      if (!voterName) return showVoterLogin();
      candidateCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedCandidate = candidate;
      showModal(selectedCandidate);
    });
    
    candidatesGrid.appendChild(card);
  });
  
  candidatesContainer.appendChild(candidatesGrid);
  candidateCards = Array.from(document.querySelectorAll('.candidate-card'));
  
  // Animate cards
  candidateCards.forEach((card, i) => {
    card.style.opacity = hasVoted ? '0.6' : '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.7s var(--transition), transform 0.7s var(--transition)';
      card.style.opacity = hasVoted ? '0.6' : '1';
      card.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });
}

function updateVoterStatus(statusDiv) {
  if (!voterName) {
    statusDiv.innerHTML = '<button class="add-btn" onclick="showVoterLogin()">Login to Vote</button>';
    statusDiv.style.background = '#f3f4f6';
  } else if (hasVoted) {
    statusDiv.innerHTML = `<span style="color:#10b981;font-weight:600;">✓ Voted as ${voterName}</span>`;
    statusDiv.style.background = '#ecfdf5';
  } else {
    statusDiv.innerHTML = `<span style="color:#3b82f6;font-weight:600;">Logged in as ${voterName} - Ready to vote</span>`;
    statusDiv.style.background = '#eff6ff';
  }
}

function randomGradient(i) {
  const gradients = [
    '#6EE7B7, #3B82F6',
    '#FDE68A, #F59E42',
    '#FCA5A5, #F43F5E',
    '#a1c4fd, #c2e9fb',
    '#fbc2eb, #a6c1ee',
    '#fda085, #f6d365'
  ];
  return gradients[i % gradients.length];
}

function showModal(candidate) {
  modalText.textContent = `Are you sure you want to vote for ${candidate}?`;
  modal.classList.add('active');
  setTimeout(() => {
    modal.querySelector('.modal-content').focus();
  }, 100);
}

closeModal.onclick = () => {
  modal.classList.remove('active');
  candidateCards.forEach(c => c.classList.remove('selected'));
  selectedCandidate = null;
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    candidateCards.forEach(c => c.classList.remove('selected'));
    selectedCandidate = null;
  }
};

confirmVote.onclick = () => {
  if (!selectedCandidate || !voterName || hasVoted) return;
  
  // Save vote count
  const votes = getVotes();
  votes[selectedCandidate] = (votes[selectedCandidate] || 0) + 1;
  setVotes(votes);
  
  // Save voter record
  const allVotes = getAllVotes();
  allVotes.push({ voter: voterName, candidate: selectedCandidate, timestamp: new Date().toISOString() });
  setAllVotes(allVotes);
  
  // Mark voter as having voted
  const votedVoters = getVotedVoters();
  votedVoters.push(voterName);
  setVotedVoters(votedVoters);
  
  hasVoted = true;
  modal.classList.remove('active');
  showToast(`Vote successfully cast for ${selectedCandidate}!`);
  candidateCards.forEach(c => c.classList.remove('selected'));
  selectedCandidate = null;
  
  // Re-render to show updated vote counts and disable voting
  setTimeout(() => {
    renderElection();
    showLogoutModal();
  }, 1000);
};

// Show logout modal and log out after 10 seconds
function showLogoutModal() {
  const logoutModal = document.getElementById('logoutModal');
  const logoutCountdown = document.getElementById('logoutCountdown');
  if (!logoutModal || !logoutCountdown) return;
  let seconds = 10;
  logoutModal.style.display = 'flex';
  logoutCountdown.textContent = `Logging out in ${seconds} seconds...`;
  const interval = setInterval(() => {
    seconds--;
    logoutCountdown.textContent = `Logging out in ${seconds} seconds...`;
    if (seconds <= 0) {
      clearInterval(interval);
      logoutModal.style.display = 'none';
      // Log out: clear session and reload
      voterName = null;
      hasVoted = false;
      renderElection();
    }
  }, 1000);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Voter login modal (uses static modal in index.html)
function showVoterLogin() {
  const modal = document.getElementById('voterLoginModal');
  if (!modal) return;
  modal.style.display = 'flex';
  const voterNameInput = document.getElementById('voterNameInput');
  const voterLoginBtn = document.getElementById('voterLoginBtn');
  const voterLoginMsg = document.getElementById('voterLoginMsg');
  const alreadyVotedMsg = document.getElementById('alreadyVotedMsg');

  function closeModal() {
    modal.style.display = 'none';
    voterLoginMsg.style.display = 'none';
    alreadyVotedMsg.style.display = 'none';
    voterNameInput.value = '';
  }

  function doLogin() {
    const name = voterNameInput.value.trim();
    if (!name) {
      voterLoginMsg.style.display = 'block';
      alreadyVotedMsg.style.display = 'none';
      return;
    }
    // Check if voter has already voted
    const votedVoters = getVotedVoters();
    if (votedVoters.includes(name)) {
      alreadyVotedMsg.style.display = 'block';
      voterLoginMsg.style.display = 'none';
      hasVoted = true;
      voterName = name;
      closeModal();
      showToast(`Welcome back, ${voterName}! You have already voted.`);
      renderElection();
      return;
    }
    voterName = name;
    hasVoted = false;
    closeModal();
    showToast(`Welcome, ${voterName}! You can now vote.`);
    renderElection();
  }

  voterLoginBtn.onclick = doLogin;
  voterNameInput.onkeydown = function(e) {
    if (e.key === 'Enter') doLogin();
  };
  setTimeout(() => { voterNameInput.focus(); }, 200);

  // Close modal on outside click
  modal.onclick = function(e) {
    if (e.target === modal) closeModal();
  };
}

// Auto-refresh vote counts every 10 seconds for dynamic updates
setInterval(() => {
  if (voterName && document.querySelector('.candidate-card')) {
    const currentTotalVotes = Object.values(getVotes()).reduce((sum, count) => sum + count, 0);
    const displayedTotal = document.querySelector('div[style*="Total votes cast"]');
    if (displayedTotal) {
      const newText = `Total votes cast: ${currentTotalVotes}`;
      if (displayedTotal.textContent !== newText) {
        renderElection(); // Re-render if vote counts changed
      }
    }
  }
}, 10000);

window.addEventListener('DOMContentLoaded', renderElection);