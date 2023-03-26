import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/mushrooms.csv"

// inladen csv data
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            console.log(results.data)

            let data = results.data.sort(() => (Math.random() - 0.5))
            let trainData = data.slice(0, Math.floor(data.length * 0.8))
            let testData = data.slice(Math.floor(data.length * 0.8) + 1)

            let decisionTree = new DecisionTree({
                // hier kan je aangeven welke kolommen genegeerd moeten worden
                ignoredAttributes: ['population'],    
                trainingSet: trainData,
                // dit is het label dat je wil gaan voorspellen
                categoryAttr: "class"          
            })

            // teken de tree
            let json = decisionTree.toJSON()
            let visual = new VegaTree('#view', 2300, 1000, json)

            let amountCorrect = 0;
            let predEdibleButPoisonous = 0;
            let predPoisonousButEdible = 0;
            let edible = 0;
            let poisonous = 0;

            for(let i=0; i<testData.length; i++) {
                // prediction
                let label = testData[i].class
                let mushroom = testData[i]
                let mushroomWithoutLabel = {...mushroom}
                delete mushroomWithoutLabel.class
                let prediction = decisionTree.predict(mushroomWithoutLabel)

                if(prediction == "e" && label == "p") {
                    predEdibleButPoisonous++
                }
                if(prediction == "p" && label == "e") {
                    predPoisonousButEdible++
                }
                if(prediction == "p" && label == "p") {
                    poisonous++
                    amountCorrect++
                }
                if(prediction == "e" && label == "e") {
                    edible++
                    amountCorrect++
                }
            }

            document.getElementById("ppap").innerHTML = poisonous
            document.getElementById("peap").innerHTML = predEdibleButPoisonous
            document.getElementById("ppae").innerHTML = predPoisonousButEdible
            document.getElementById("peae").innerHTML = edible

            // bereken de accuracy
            let totalAmount = testData.length;
            let accuracy = amountCorrect / totalAmount;
            document.getElementById("accuracy").innerHTML = `The models accuracy is: ${accuracy}`

            // export model
            let exportModelJson = decisionTree.stringify()
            console.log('The model will follow')
            console.log(exportModelJson)
        }
    })
}

loadData()



