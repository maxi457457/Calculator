let displayValue = '';
let history = [];

function addToDisplay(value) {
    displayValue += value;
    document.getElementById('display').value = displayValue;
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('display').value = displayValue;
}

function calculate() {
    try {
        const result = eval(displayValue);
        history.push({ operation: displayValue, result: result });
        updateHistory();
        displayValue = result.toString();
        document.getElementById('display').value = displayValue;
    } catch (error) {
        displayValue = 'Error';
        document.getElementById('display').value = displayValue;
    }
}

function updateHistory() {
    const jsonString = JSON.stringify(history);
  
    fetch('/update-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonString
    })
    .then(response => {
      if (response.ok) {
        console.log('Historial actualizado correctamente en el servidor.');
      } else {
        console.error('Error al actualizar el historial en el servidor.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach(entry => {
      const listItem = document.createElement('li');
      listItem.textContent = `${entry.operation} = ${entry.result}`;
      historyList.appendChild(listItem);
    });
  }
  
