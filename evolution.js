let population = 25;
let mutationParameter = 4e-2;
let chooseFittest = 0.5;
let mp=[0.01,0.08,0.16,0.4];
let cf=[0.3,0.4,0.9];

function clone(car){
  let res = new Car();
  res.network.set(car.network);
  return res;
}

class Evolution{
    constructor(){
        this.pop =  [];   
        this.fitness = [];
        this.maxfitvals = [];
        this.val = [];
        this.generation = 0;
        this.mostfit = 0;
        this.gen_count = [];
        
        this.i=0;
        this.j=0;
        this.z=0;
    }
    startLife(){
        this.generation=0;
        this.pop=[];
        this.maxfitvals = [];
        if(test_type==0)
            this.experiment();
        for(let i=0; i<population; i++){
            this.pop.push(new Car());
        }
        this.resetFitness();
    }
    resetFitness(){
        this.fitness = [];
        for(let i=0; i<population; i++){
            this.fitness.push(0);
        }
    }



    select(){

        /*
        
            Tasks in this function:

            1. this.fitness contains the fitness values of all the cars in the population

            find the probability of selection of the i-th car in the population is given by:

            Probability_selection = Normalizing_factor * { exp(this.fitness[i] /  total_fitness) } 
            
            where the normalizing factor ensures that the sum of all probabilities is equal to 1 and total_fitness 
            is the sum of all fitness values.

            2. Find the index of the mostfit individual and assign it to this.mostfit
            3. Push the maximum fitness value of the population to the list this.maxfitvals
            4. Sample the car index from the probability_selection distribution's cumulative density function.
            5. Create a new list newpop, in which add a cloned version of the fittest car. This won't be mutated because
            as you can see in the mutate function, i starts from 1.
            6. Using (4) and (5), generate the new population. Note that chooseFittest parameter should` also be used,
            in which we choose the fittest car with a probability of "chooseFittest". Ultimately, store the new population
            back in this.pop array. Note that objects are assigned by reference in JavaScript and hence
            you need to use the given clone function to assign by value.

            Already existing functions that you might need to call in this code:
            exp(number): returns e raise to the power of that number
            random(): returns a uniform random number between 0 and 1
            clone(car): (implemented in this file) returns a new car with the same neural network as that of car
        */

         // Write your code here
        let probabilty = [];
        let sum = 0;
        for(let i=0;i<population;i++){
            sum+=this.fitness[i];
        }
        for(let i=0;i<population;i++){
            probabilty.push(exp(this.fitness[i]/sum));
        }
        let probabilty_sum = 0;
        for(let i=0;i<population;i++){
            probabilty_sum+=probabilty[i];
        }
        for(let i=0;i<population;i++){
            probabilty[i] = probabilty[i]/probabilty_sum;
        } 
        
        let max = Math.max.apply(Math,this.fitness);
        let index = this.fitness.indexOf(max);
        this.maxfitvals.push(max);
        //console.log(max);
        this.mostfit = index

        let newpop = [];
        newpop.push(clone(this.pop[this.mostfit]));
        let j = 1;
        while(j<population){
            let x = random()
            if(x<chooseFittest){
                newpop.push(clone(this.pop[this.mostfit]));
                j++;
                continue;
            }
            let i = -1;
            let cdf  = 0
            let y = random()
            while(true){
                if(cdf>y){
                    break;
                }
                else{
                    i++;
                    cdf += probabilty[i];
                } 
            }
            newpop.push(clone(this.pop[i]));
            j++;
        }
        this.pop = newpop;
        this.generation++;
        if(test_type==0){
            if(max>120 || this.generation==10){
                this.gen_count.push(this.generation);
                this.generation = 10;
            }
        
            if(this.generation>=10){
                this.val.push(max);
                if(this.z%5==0){
                    console.log(chooseFittest);
                    console.log(mutationParameter);
                    let avg = 0;
                    for(let k=0;k<this.val.length;k++){
                        avg+=this.val[k];
                    }
                    avg= avg/this.val.length;
                    console.log(avg);
                    console.log(this.val);
                    console.log(this.gen_count);
                    this.val = [];
                    this.gen_count = [];
                }
                this.startLife();
            }
        }
        if(test_type==1){
            this.val.push(max);
            if(this.generation==15){
                console.log(chooseFittest);
                console.log(mutationParameter);
                console.log(this.val);
            }
        }

    }
    mutateGeneration(){
        for(let i=1; i<population; i++){
            this.pop[i].network.mutate();
        }
    }
    updateFitness(){
        let changed = false;
        for(let i=0; i<population; i++){
            if(this.fitness[i] != this.pop[i].fitness){
                changed = true;
                this.fitness[i] = this.pop[i].fitness;
            }
        }
        return changed;
    }

    experiment(){
        
        
        if(this.z%5==0){
            chooseFittest=cf[this.i];
            mutationParameter=mp[this.j];
            this.j++;
            if(this.j==5){

                this.j=0;
                this.i++;
            }
            if(this.i==10){
                this.i=0;
            }
        }    
        this.z++;   
    }
}
