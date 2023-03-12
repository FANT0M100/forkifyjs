import axios from "axios"


export default class Recipe {
    constructor(id){
        this.id = id
    }

    async getRecipe(){
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
    };

    calcTime(){
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15;
    };

    calcServings() {
        this.servings = 4;
    };

    parseIngredients(){
        const newIngredients =  this.ingredients.map(el => {
            const unitLong = ["tablespoons", 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups'];
            const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup'];
            const units = [...unitShort, 'kg', 'g', 'pound'];

            //1. uniform units
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i])
            });

            //2. remove paranetheses (frcxilebis mocileba)
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. parse ingredients into count, unit and igredient
            //1/2 tsp salt = ['1/2', 'tsp', 'salt']
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(value => units.includes(value));

            let objIng;
            if(unitIndex > -1) {
                //there is a unit  
                //ex: 4; 1/2; [4, 1/2] => 4.5 
                //ex: 4; [4] => 4
                //ex: 1/2; [1/2] => 0.5
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0]);
                }else{
                    count = eval(arrCount.join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            }else if(parseInt(arrIng[0], 10)){
                //there is no unit, but number
                objIng = {
                    count: +arrIng[0],
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                //there is not unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    };

    updateServings(type){
        //servings
        const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients
        this.ingredients.forEach(ing => ing.count *= (newServing / this.servings));

        this.servings = newServing;
    };
};