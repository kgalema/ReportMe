const Service = require('node-windows').Service;
const svc = new Service({
	name: "Declaration",
	description: "Node.js service description goes here.",
	script: "C:\\Users\\Ronny Ramushu\\OneDrive\\Documents\\Software Engineering\\Projects\\ReportMe\\app.js",
	nodeOptions: ["--harmony", "--max_old_space_size=4096"],
	env: {
		SECRET: "LebohangM",
		secretCode: "@secreteCode123#",
	},
});

svc.on('uninstall',function(){
// svc.on('install',function(){
//  svc.start();
 console.log("Uninstall complete")
});

// svc.install();
svc.uninstall();