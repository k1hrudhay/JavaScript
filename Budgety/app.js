

// Budget Controller App
var budgetController = (function(){

    var Expense = function(ID,description,value){
        this.ID = ID;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.percentageCalc = function(income){
        if(income > 0) {
            this.percentage = Math.round((this.value / income) * 100);
        } else {
            this.percentage = -1;
        }
    };

    var Income = function(ID,description,value){
        this.ID = ID;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems : {
            exp : [],
            inc : []
        },

        allTotals : {
            exp : 0,
            inc : 0
        },

        budget : 0 ,
        expPercentage : -1
    };

    var totalCalculator = function(arr){
        var total = 0;

        for(var i = 0; i < arr.length ; i++){
            total += arr[i].value;
        }

        return total;

    };

    return {
        
        addItem : function(type,description,value){
            var ID,element;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].ID + 1 ;
            } else {
                ID = 0;
            };

            if(type === 'exp'){
                element = new Expense(ID,description,value);
                data.allItems['exp'].push(element);
            } else if(type === 'inc') {
                element = new Income(ID,description,value);
                data.allItems['inc'].push(element);
            };

            return element;
        },

        calcBudget : function(){
            
            data.allTotals['inc'] = totalCalculator(data.allItems['inc']);
            data.allTotals['exp'] = totalCalculator(data.allItems['exp']);

            if(data.allTotals['inc'] > 0){
                data.budget = data.allTotals['inc'] - data.allTotals['exp'];
                data.expPercentage = Math.round((data.allTotals['exp'] / data.allTotals['inc']) * 100);
            }
            else {
                data.budget = 0
                data.expPercentage = -1;
            };
        },

        calcPercentages : function(){

            data.allItems['exp'].forEach(function(curr){
                curr.percentageCalc(data.allTotals['inc']);
            });

        },

        getPercentages : function(){
            var percentages = [];

            percentages = data.allItems['exp'].map(function(curr){
                return curr.percentage;
            });

            return percentages;
        },

        getData : function(){
            return {
                totalInc : data.allTotals['inc'],
                totalExp : data.allTotals['exp'],
                totalBgt : data.budget,
                totalExpPercent : data.expPercentage
            }
        },

        deleteData : function(type,id){
            var ids,index;

            ids = data.allItems[type].map(function(curr){
                return curr.ID;
            });

            index = ids.indexOf(id);

            if( index !== -1 ){
                data.allItems[type].splice(index,1);
            }

        },

        tempDisplay : function(){
            return data;
        }

    };

})();


// UI Controller App
var UIController = (function(){

    var DOMStrings = {
        inputButton : '.add__btn',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputType :  '.add__type',
        incContainer : '.income__list',
        expContainer : '.expenses__list',
        totalIncome : '.budget__income--value',
        totalExpenses : '.budget__expenses--value',
        totalBudget : '.budget__value',
        totalExpPercentage : '.budget__expenses--percentage',
        percentagesLabel : '.item__percentage',
        containerContainer : '.container',
        dateLabel : '.budget__title--month'

    };

    var formatNumber = function(type,number){
        
        var num,int,dec;

        num = Math.abs(number);
        num = num.toFixed(2);
        int = num.split('.')[0];
        dec = num.split('.')[1];

        if(int.length > 3){
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,);
        };

        return (type === 'inc' ? '+' : '-') + int + '.' + dec;


        
    };

    return {

        getInput : function(){
            return {

                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value),
                type : document.querySelector(DOMStrings.inputType).value

            };

        },

        addNewItem : function(type,item){
            var html,newHtml,container;
            
            // 1. Create HTML string with placeholders
            if(type === 'exp'){
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                container = DOMStrings.expContainer;

            } else if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                container = DOMStrings.incContainer;
            }

            // 2. Replace the placholders with the respective values
            newHtml = html.replace('%id%',item.ID);
            newHtml = newHtml.replace('%description%',item.description);

            newHtml = newHtml.replace('%value%',formatNumber(type,item.value));

            // 3. Insert the HTML into the DOM.
            document.querySelector(container).insertAdjacentHTML('beforeend',newHtml);

        },

        displayData : function(data){
            var type;

            data.totalBgt > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.totalIncome).textContent = formatNumber('inc',data.totalInc);
            document.querySelector(DOMStrings.totalExpenses).textContent = formatNumber('exp',data.totalExp);
            document.querySelector(DOMStrings.totalBudget).textContent = formatNumber(type,data.totalBgt);

            if(data.totalExpPercent !== -1 && data.totalExpPercent > 0){
                document.querySelector(DOMStrings.totalExpPercentage).textContent = data.totalExpPercent + '%';
            } else {
                document.querySelector(DOMStrings.totalExpPercentage).textContent = '---';
            }
            
            
        },

        displayPercentages : function(percentages){
            var fields;

            fields = document.querySelectorAll(DOMStrings.percentagesLabel);

            fields.forEach(function(curr,i){
                if(percentages[i] !== -1){
                    curr.textContent = percentages[i] + '%';
                } else {
                    curr.textContent = '---';
                }
                
            })

        },

        displayDate : function(){

            var date,year,month,months;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            date = new Date();
            year = date.getFullYear();
            month = date.getMonth();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        deleteItem : function(pNodeID){

            var el;

            el = document.getElementById(pNodeID);
            el.parentNode.removeChild(el);

        },

        clearFields : function(){
            var fields;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            fields.forEach(function(curr){
                curr.value = '';
            });

            document.querySelector(DOMStrings.inputDescription).focus();
        },

        changeFormat : function(){
            var fields;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue + ',' + DOMStrings.inputType);
            fields.forEach(function(curr){
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputButton).classList.toggle('red');


        },

        getDomStrings : function(){
            return DOMStrings
        } 

    }

})();

// Global Controller App
var controller = (function(budgetCtrl,UICtrl){

    var DOM = UICtrl.getDomStrings();

    var setEventListeners = function(){

        // 1. Set event listeneres for the startup.
            document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddEvent);

            document.addEventListener('keypress',function(event){
                if(event.keyCode == 13 || event.which == 13){
                    ctrlAddEvent();
                }
            });      

            document.querySelector(DOM.containerContainer).addEventListener('click',ctrlDeleteEvent);

            document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeFormat);

    };

    var budgetCalculator = function(){

        // 1. Calculate the budget.
            budgetCtrl.calcBudget();

        // 2. Get the data.
            data = budgetCtrl.getData();

        // 3. Display the data.
            UICtrl.displayData(data);

    };

    var calculatePercentages = function(){

        // 1. Calculate percentages.
        budgetCtrl.calcPercentages();

        // 2. Get the percentages.
        var percentages = budgetCtrl.getPercentages();

        // 3. Display the percentages.
        UICtrl.displayPercentages(percentages);
    };

    var  ctrlAddEvent = function(){ 

        var input, newItem, data;

        // 1. Get the values.
            input = UICtrl.getInput();

        
            if(input.description !== '' && !isNaN(input.value) && input.value > 0){

                // 2. Add the values to the budget controller
                    newItem = budgetCtrl.addItem(input.type,input.description,input.value);

                // 3. Display the values in the UI
                    UICtrl.addNewItem(input.type,newItem);
                    UICtrl.clearFields();
                
                // 4. Calculate and Display Budget.
                    budgetCalculator();

                // 5. Calculate and Display Percentages.
                    calculatePercentages();

            };

        };

    var ctrlDeleteEvent = function(event){

        var pNodeID,type,id;

        // 1. Get the event target.
        pNodeID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        // 2. Get the event details.
        type = pNodeID.split('-')[0];
        id = parseInt(pNodeID.split('-')[1]);

        // 3. Delete the item from the data.
        budgetCtrl.deleteData(type,id);

        // 4. Recalculate the budget and percentages.
        budgetCalculator();
        calculatePercentages();

        // 4. Delete the item from the UI.
        UICtrl.deleteItem(pNodeID);

    };



    return {


        init : function(){
            setEventListeners();
            UICtrl.displayData({
                totalInc : 0,
                totalExp : 0,
                totalBgt : 0,
                totalExpPercent : '---'
            });
            UICtrl.displayDate();
        }

    };

})(budgetController,UIController);

controller.init();