const getData = async () => {
  const response = await fetch(
    "https://afcom-realtime.herokuapp.com/api/v1/afcomRealtime"
  );
  const data = await response.json();
  return data;
};
const populateSchool = async () => {
  let schoolsMenu = document.getElementById("schools");

  const schoolData = await getData();
  const uniqueSchool = [
    ...new Map(schoolData.map((item) => [item["schoolName"], item])).values(),
  ];

  let menu = "";

  uniqueSchool.forEach((school) => {
    menu += `<a href="#${school._id}" onclick="populateGraph('${school.hostId}','${school.schoolName}'); populateTable('${school.hostId}')" class="w3-bar-item w3-button w3-hover-white">${school.schoolName}</a> `;
  });
  schoolsMenu.innerHTML = menu;
};

populateSchool();

const populateGraph = async (hostId, schoolName) => {
  const graph = document.querySelector("#graph");
  graph.innerHTML = schoolName != undefined ? "(" + schoolName + ")" : "";
  const data = await getData();

  const filtered = data.filter((d) => d.hostId == hostId);
  console.log(filtered);
  let bitReceived = [];
  let bitSent = [];
  let label = [];
  filtered.forEach((school) => {
    label.push(
      new Date(school.createdAt).toDateString() +
        " (" +
        new Date(school.createdAt).toLocaleTimeString() +
        ")"
    );
    bitReceived.push(parseFloat(school.bitReceived.slice(0, -4)));
    bitSent.push(parseFloat(school.bitSent.slice(0, -4)));
  });

  const chartData = {
    labels: label,
    datasets: [
      {
        name: "Bit Received",
        values: bitReceived,
      },
      {
        name: "Bit Sent",
        values: bitSent,
      },
    ],
  };

  const chart = new frappe.Chart("#chart", {
    data: chartData,
    type: "line", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
    height: 350,
    colors: ["#7cd6fd", "#743ee2"],
    lineOptions: {
      regionFill: 1, // default: 0
    },
  });
};
populateGraph("10420");
const populateTable = async (hostId) => {
  let content = `
    <tr>
        <th>Timestamp</th>
        <th>Bit Received</th> 
        <th>Bit Sent</th>
    </tr>
    `;
  const table = document.querySelector("#table");

  const data = await getData();

  const filtered = data.filter((d) => d.hostId == hostId);
  filtered.forEach((school) => {
    content += `<tr><td>${
      new Date(school.createdAt).toDateString() +
      " (" +
      new Date(school.createdAt).toLocaleTimeString() +
      ")"
    }</td><td>${
      school.bitReceived != undefined ? school.bitReceived : ""
    }</td><td>${school.bitSent != undefined ? school.bitSent : ""}</td></tr>`;
  });
  table.innerHTML = content;
};

populateTable("10420");
