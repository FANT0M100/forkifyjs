import axios from "axios"


export default class Recipe {
    constructor(id){
        this.id = id
    }

    async getResult(){
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
    };
};