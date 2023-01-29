async function main() {

	//assign to deployer the signers address
	const [deployer] = await ethers.getSigners();

	console.log( "Deploying contracts with the account:", deployer.address );

	console.log("Account balance:", (await deployer.getBalance()).toString());

	//define constructor inputs
	const n = 7;

	//assing to contractname our compiled contract
	const contractname = await hre.ethers.getContractFactory("ExampleContract");

	//deploy contract
	const contract = await contractname.deploy(n);

	console.log("Contract deployed at:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });