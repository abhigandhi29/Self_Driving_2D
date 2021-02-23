let population = 25;
let mutationParameter = 4e-2;
let chooseFittest = 0.5;

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
        this.generation = 0;
        this.mostfit = 0;
    }
    startLife(){
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
        let index = this.fitness.findIndex(max);
        this.maxfitvals.push(max);
        this.mostfit = index

        let newpop = [];
        newpop.push(this.pop[this.mostfit]);
        let j = 1;
        while(j<25){
            let x = random()
            let i = -1;
            let cdf  = 0
            while(true){
                if(cdf>x){
                break;
                }
                else{
                    i++;
                    cdf += this.fitness[i];
                } 
            }
            if(this.fitness[i]>=chooseFittest){
                newpop.push(this.pop[i]);
                j++;
            }
        }
        this.pop = newpop;

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
}
