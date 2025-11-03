const defaultPlans = [
    { name: 'Basic', price: '19.99', unit: 'per month', features: ['10 GB Storage', '10 Emails', '5 Domains', '1 End User'], color: 'white' },
    { name: 'Pro', price: '29.99', unit: 'per month', features: ['25 GB Storage', '25 Emails', '10 Domains', '1 User'], color: 'black', popular: true }, // Añadido 'popular' para el destaque
    { name: 'Premium', price: '49.99', unit: 'per month', features: ['50 GB Storage', '50 Emails', '15 Domains', '1 User'], color: 'white' }
];


class PricingTable extends HTMLElement {
    constructor() {
        super();
        this.root = this;
        this.plans = defaultPlans; 
    }

    connectedCallback() {
        console.log('<pricing-table> fue conectado al DOM.');
        this.render();
    }

    disconnectedCallback() {
        console.log('<pricing-table> fue desconectado del DOM.');
        this.root.innerHTML = ''; 
    }

    attributeChangedCallback(name, oldValue, newValue) {}
    adoptedCallback() {}

    /**
     * Método para actualizar los datos y regenerar la interfaz.
     * @param {Array} newPlans - Array de nuevos objetos de planes.
     */
    setPlans(newPlans) {
        this.plans = newPlans;
        this.render(); 
    }


    render() {
        this.root.innerHTML = '';

        const mainContainer = document.createElement('div');
        mainContainer.classList.add('w3-row-padding');
        this.root.appendChild(mainContainer);

        this.plans.forEach(plan => {
            const column = document.createElement('div');
            column.classList.add('w3-third', 'w3-margin-bottom');
            mainContainer.appendChild(column);

            const ulCard = document.createElement('ul');
            ulCard.classList.add('w3-ul', 'w3-border', 'w3-center');
            column.appendChild(ulCard);

            const headerLi = document.createElement('li');
        
            if (plan.color === 'black') {
                headerLi.classList.add('w3-black', 'w3-xlarge', 'w3-padding-32');
                
                if (plan.popular) {
                    const popularDiv = document.createElement('div');
                    popularDiv.classList.add('w3-tag', 'w3-round', 'w3-red', 'w3-right');
                    popularDiv.style.marginRight = '-16px';
                    popularDiv.innerText = 'Popular';
                    headerLi.appendChild(popularDiv);
                }
                
            } else {
                headerLi.classList.add('w3-theme', 'w3-xlarge', 'w3-padding-32');
            }
            
            headerLi.appendChild(document.createTextNode(plan.name));
            ulCard.appendChild(headerLi);

            plan.features.forEach(feature => {
                const featureLi = document.createElement('li');
                featureLi.classList.add('w3-padding-16');
                featureLi.innerText = feature;
                ulCard.appendChild(featureLi);
            });
            
            const separatorLi = document.createElement('li');
            separatorLi.classList.add('w3-light-grey', 'w3-padding-24');
            ulCard.appendChild(separatorLi);

            const priceH2 = document.createElement('h2');
            priceH2.innerText = '$' + plan.price; 
            separatorLi.appendChild(priceH2);
            
            const unitSpan = document.createElement('span');
            unitSpan.classList.add('w3-opacity');
            unitSpan.innerText = plan.unit;
            separatorLi.appendChild(unitSpan);

            const buttonLi = document.createElement('li');
            buttonLi.classList.add('w3-light-grey', 'w3-padding-24');
            ulCard.appendChild(buttonLi);

            const signupButton = document.createElement('button');
            signupButton.classList.add('w3-button', 'w3-green', 'w3-padding-large');
            signupButton.innerText = 'Sign Up';
            signupButton.addEventListener('click', () => {
                alert(`Seleccionaste el plan: ${plan.name}`);
            });
            
            buttonLi.appendChild(signupButton);
        });
    }
}

customElements.define('pricing-table', PricingTable);