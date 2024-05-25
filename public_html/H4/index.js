let DataLoad = () => {
    try {

        let uuid = () => {
            let txt = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
            let c = 0;
            let r = ``
            for (let i = 0; i < txt.length; i++) {
                r += txt.charAt(Math.floor(Math.random() * txt.length))
                c += 1;
            }
            return r
        };

        let form = document.querySelector('form');
        let inputs = form.querySelectorAll('input');
        let butNS = form.querySelector('.butNS');
        let nI = document.createElement(`input`)

        if (form && inputs.length > 0 && butNS) {
            form.addEventListener('submit', e => {
                let isValid = true;
                // 
                try {
                    inputs.forEach((v, k) => {
                        if (v.value.trim().length === 0) {
                            e.preventDefault();
                            isValid = false;
                            alert(`Please enter a value to continue.`);
                        } else if (v.name.toLowerCase() === 'author' && v.value.split(/\s+/).length < 2) {
                            e.preventDefault();
                            isValid = false;
                            alert(`Please enter the full name of the Author to continue.`);
                        } else if (v.name.toLowerCase() === 'year' && (v.value.split(/\s+/).length > 1 || parseInt(v.value) < 2000 || parseInt(v.value) > new Date().getFullYear())) {
                            e.preventDefault();
                            isValid = false;
                            alert(`Invalid date entered. Date range must be between 2000 to ${new Date().getFullYear()}`);
                        } else {
                            nI.name = "id"
                            nI.style.display = 'none'
                            nI.style.pointerEvents = 'none'
                            nI.value = `id_${uuid()}`
                                // 
                            form.appendChild(nI)

                            if (!nI.value || nI.value.trim().length < 1) {
                                e.preventDefault();
                                DataLoad()
                            }
                        }
                    });
                } catch {
                    e.preventDefault();
                    alert(`Something went wrong. Please try again.`);
                }
            });
        } else {
            setTimeout(DataLoad, 2000);
        }
    } catch {
        setTimeout(DataLoad, 2000);
    }
};

window.addEventListener('DOMContentLoaded', e => {
    DataLoad();
});