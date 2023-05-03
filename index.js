const risk = {
    armyA,
    armyB,
    targetInputArmyA : document.getElementById('armyA'),
    targetInputArmyB : document.getElementById('armyB'),
    targetbtnStartWar : document.getElementById('btnStartWar'),
    targetResultA : document.getElementById('resultA'),
    targetResultB : document.getElementById('resultB'),
    targetPropability : document.getElementById('propability'),
    targetLivingSoldiersSection : document.getElementById('livingSoldiers'),
    targetaverageDeads : document.getElementById('averageDeads'),

    // ===== INIT ===== \\
    init : () => {
        // hidden livingSoldiers section
        risk.targetLivingSoldiersSection.style.display = 'none';
        // display probability
        risk.probability();
        // add event listner
        risk.targetbtnStartWar.addEventListener('click', risk.handleAttack);
        risk.targetInputArmyA.addEventListener('change', risk.handleChangeArmy);
        risk.targetInputArmyB.addEventListener('change', risk.handleChangeArmy);
    },

    // ===== HANDLE ===== \\
    handleChangeArmy : () => {
        // hidden livingSoldiers section
        risk.targetLivingSoldiersSection.style.display = 'none';
        // verify value upper min
        if (risk.targetInputArmyA.value < 2) risk.targetInputArmyA.value = 2;
        if (risk.targetInputArmyB.value < 1) risk.targetInputArmyB.value = 1;
        // display new propabiliy
        risk.probability();
    },
    
    handleAttack : (event) => {
        event.preventDefault();
        // war and display
        risk.war();
        risk.displayWarResult();
    },
    
    // ===== UTILS ===== \\
    createArmies : () => {
        // get input value
        risk.armyA = +risk.targetInputArmyA.value;
        risk.armyB = +risk.targetInputArmyB.value;
    },
    
    rollDices : (quantity) => {
        // roll dices
        const dices = [];
        for (let i = 0; i < quantity; i++) {
            dices.push(Math.floor(Math.random() * 6 + 1));
        }
        // sort in ascending order
        dices.sort((a, b) => b - a);

        return dices;
    },

    displayWarResult : () => {
        // display quantity living soldiers
        risk.targetResultA.textContent = risk.armyA;
        risk.targetResultB.textContent = risk.armyB;
        // display block section
        risk.targetLivingSoldiersSection.style.display = 'block';
    },

    // ===== PROBABILITY ===== \\
    probability : () => {
        let countVictory = 0;
        let countDeadsA = 0;
        // start 1000 wars
        for (let i = 0; i < 1000; i++) {
            const result = risk.war();
            if (result.isVictory) countVictory++;
            countDeadsA += result.countDeadsA;
        }
        // display
        risk.targetPropability.textContent = Math.round(countVictory/10);
        risk.targetaverageDeads.textContent = countDeadsA/1000;
    },

    // ===== FONCTIONNALITIES ===== \\
    war : () => {
        // init armies
        risk.createArmies();
        let countDeadsA = 0;

        // battles series
        while (risk.armyA >= 2 && risk.armyB > 0) {
            // quantity dices
            let qtySoldiersA = 0;
            let qtySoldiersB = 0;
            risk.armyA <= 4 ? qtySoldiersA = risk.armyA - 1 : qtySoldiersA = 3;
            risk.armyB <= 2 ? qtySoldiersB = 1 : qtySoldiersB = 2;

            // get battle results
            const result = risk.battle(qtySoldiersA, qtySoldiersB);

            // delete deads units of army
            risk.armyA -= result.deadsA;
            risk.armyB -= result.deadsB;
            countDeadsA += result.deadsA;
        }

        // return victory of attacking army
        const isVictory = risk.armyA > risk.armyB
        return {isVictory, countDeadsA};
    },
    
    battle : (qtySoldiersA, qtySoldiersB) => {
        // roll dices
        const dicesA = risk.rollDices(qtySoldiersA);
        const dicesB = risk.rollDices(qtySoldiersB);

        // select smaller army
        let qtySmallerArmy = qtySoldiersB;
        if (qtySoldiersA < qtySoldiersB) qtySmallerArmy = qtySoldiersA;
    
        // compare dices to calculate kills
        let deadsA = 0;
        let deadsB = 0;
        for (let i = 0; i < qtySmallerArmy; i++) {
            dicesA[i] > dicesB[i] ? deadsB++ : deadsA++;
        }

        return {deadsA, deadsB};
    }
}

document.addEventListener('DOMContentLoaded', risk.init);