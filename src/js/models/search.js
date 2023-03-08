import axios from "axios";


export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try {
            const result = await axios(`http://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = result.data.recipes;
        } catch (error) {
            alert(error)
        }
    }
}