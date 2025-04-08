document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const birthDateParam = urlParams.get('bd');
  const viewModeParam = urlParams.get('vm');
  const averageLifeExpectancyYearsParam = urlParams.get('le');

  let birthDate;
  if (birthDateParam) {
    const [month, day, year] = birthDateParam.split('.').map(Number);
    birthDate = new Date(year, month - 1, day + 1);
  } else {
    const today = new Date();
    birthDate = new Date(today.getFullYear() - 35, today.getMonth(), today.getDate());
  }

  document.getElementById('birthDate').valueAsDate = birthDate;
  document.getElementById('viewMode').value = viewModeParam || 'monthly';
  document.getElementById('averageLifeExpectancyYears').value = averageLifeExpectancyYearsParam || 80;

  document.getElementById('birthDate').addEventListener('change', updateVisualization);
  document.getElementById('viewMode').addEventListener('change', updateVisualization);
  document.getElementById('viewMode').addEventListener('change', updateDescription);
  document.getElementById('averageLifeExpectancyYears').addEventListener('input', updateVisualization);

  function updateURLParams() {
    const birthDateValue = document.getElementById('birthDate').value.split('-').join('.');
    const viewModeValue = document.getElementById('viewMode').value;
    const averageLifeExpectancyYearsValue = document.getElementById('averageLifeExpectancyYears').value;

    const params = new URLSearchParams({
        'bd': birthDateValue,
        'vm': viewModeValue,
        'le': averageLifeExpectancyYearsValue
    });

    window.history.replaceState({}, '', '?' + params.toString());
  }

  document.getElementById('birthDate').addEventListener('change', updateURLParams);
  document.getElementById('viewMode').addEventListener('change', updateURLParams);
  document.getElementById('averageLifeExpectancyYears').addEventListener('input', updateURLParams);

  updateVisualization();
});

function updateDescription() {
  const viewModeSelect = document.getElementById('viewMode');
  const descriptionElement = document.getElementById('description');
  const viewModeValue = viewModeSelect.value;

  if (viewModeValue == 'monthly') {
    descriptionElement.textContent = 'Each square represents one month of your life.';
  } else if (viewModeValue == 'weekly') {
    descriptionElement.textContent = 'Each square represents one week of your life.';
  }
}

function updateVisualization() {
  const birthDateInput = document.getElementById('birthDate');
  const viewModeSelect = document.getElementById('viewMode');
  const averageLifeExpectancyYears = document.getElementById('averageLifeExpectancyYears') ? document.getElementById('averageLifeExpectancyYears').valueAsNumber : 80;

  if (!birthDateInput.value) return;

  const today = new Date();

  const birthDate = new Date(birthDateInput.value);
  
  const averageLifeExpectancyMilliseconds = averageLifeExpectancyYears * 365.25 * 24 * 60 * 60 * 1000; // accounting for leap years
  const lifeSpanEnd = new Date(birthDate.getTime() + averageLifeExpectancyMilliseconds);

  let currentDate = birthDate;
  const blocksDiv = document.getElementById('visualization');
  blocksDiv.innerHTML = '';

  while (currentDate < lifeSpanEnd) {
      const block = document.createElement('div');
      block.className = 'block';

      // Determine the class based on current date
      if (viewModeSelect.value === 'weekly') {
          const startOfWeek = new Date(currentDate);
          const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000); // End of the week

          if (today >= startOfWeek && today <= endOfWeek) {
              block.classList.add('current');
          } else if (today < startOfWeek) {
              block.classList.add('future');
          } else {
              block.classList.add('past');
          }

          currentDate.setTime(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // add a week
      } else { // monthly
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

          if (today >= startOfMonth && today <= endOfMonth) {
              block.classList.add('current');
          } else if (today < startOfMonth) {
              block.classList.add('future');
          } else {
              block.classList.add('past');
          }

          const month = currentDate.getMonth();
          currentDate.setMonth(month + 1);
          if (currentDate.getMonth() !== ((month + 1) % 12)) {
              currentDate.setDate(0); // handle month end edge case
          }
      }

      blocksDiv.appendChild(block);
  }
}