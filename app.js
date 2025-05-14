let chart;

// Load saved values
window.addEventListener('load', () => {
  document.getElementById('car').value = localStorage.getItem('car') || '';
  document.getElementById('ac').value = localStorage.getItem('ac') || '';
  document.getElementById('meat').value = localStorage.getItem('meat') || '';
});

//handle form submission
document.getElementById("footprint-form").addEventListener("submit", function(e) {
  e.preventDefault(); //prevent page reloading

  //get input values
  const car = parseFloat(document.getElementById("car").value) || 0;
  const ac = parseFloat(document.getElementById("ac").value) || 0;
  const meat = parseFloat(document.getElementById("meat").value) || 0;

  //save to local storage
  localStorage.setItem('car', car);
  localStorage.setItem('ac', ac);
  localStorage.setItem('meat', meat);

  //carbon emission calculation
  const carCO2 = car * 0.21;
  const acCO2 = ac * 1.5 * 7;
  const meatCO2 = meat * 2.5;
  const total = carCO2 + acCO2 + meatCO2;

  //display result
  document.getElementById("results").style.display = "block";
  document.getElementById("total").textContent = `${total.toFixed(2)} kg CO₂/week`;

  //bar style chart display 
  const chartDiv = document.getElementById("chart");
  chartDiv.innerHTML = `
    <div style="width:${carCO2 * 2}px">Car: ${carCO2.toFixed(1)} kg</div>
    <div style="width:${acCO2 * 2}px">AC: ${acCO2.toFixed(1)} kg</div>
    <div style="width:${meatCO2 * 2}px">Meat: ${meatCO2.toFixed(1)} kg</div>
  `;

  //generating carbon saving tips
  const tips = document.getElementById("tips");
  tips.innerHTML = "";
  if (car > 50) tips.innerHTML += "<li>Consider carpooling or using public transport.</li>";
  if (ac > 4) tips.innerHTML += "<li>Limit AC usage or increase the temperature setting.</li>";
  if (meat > 5) tips.innerHTML += "<li>Try adding more plant-based meals to your diet.</li>";
  if (total < 10) tips.innerHTML += "<li>Great job! You have a low carbon footprint.</li>";

  //render pie chart using chart.js
  const ctx = document.getElementById('footprintChart').getContext('2d');
  if (chart)
    chart.destroy(); //destroy old chart instances

  //create new chart
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Car', 'AC', 'Meat'],
      datasets: [{
        label: 'Carbon Footprint Breakdown',
        data: [carCO2, acCO2, meatCO2],
        backgroundColor: ['#00796B', '#0288D1', '#C2185B'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
});

//dark mode button
const darkModeButton = document.getElementById('darkModeButton');

darkModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  // Update button text
  if (document.body.classList.contains('dark')) {
    darkModeButton.textContent = 'Light Mode';
  } else {
    darkModeButton.textContent = 'Dark Mode';
  }
});

// Download as PDF
document.getElementById('downloadPDF').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Carbon Footprint Report', 20, 20);

  doc.setFontSize(12);
  //retrieve input and result values
  const car = document.getElementById("car").value;
  const ac = document.getElementById("ac").value;
  const meat = document.getElementById("meat").value;
  const total = document.getElementById("total").textContent;

  //add data to pdf
  doc.text(`Car travel (km/week): ${car}`, 20, 40);
  doc.text(`AC usage (hours/day): ${ac}`, 20, 50);
  doc.text(`Meat meals (per week): ${meat}`, 20, 60);
  doc.text(`Total Carbon Footprint: ${total}`, 20, 80);

  //save pdf file
  doc.save('carbon_footprint_report.pdf');
});
