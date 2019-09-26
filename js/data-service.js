class DataService{
	constructor(){
		this.countriesList=[];
	}

	getCountries(){
		return this.countriesList;
	}

	setCountries(data){
		this.countriesList = data;
	}
}

const dataService= new DataService();
export default dataService;