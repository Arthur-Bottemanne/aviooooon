export class AlertView {
    constructor(containerId = "collision-banner") {
        this.container = document.getElementById(containerId);
    }

    renderIntersectionAlert() {
        this.container.classList.add("visible-alert");
        this.container.classList.remove("hidden-alert");

        setTimeout(() => {
            this.container.classList.add("hidden-alert");
            this.container.classList.remove("visible-alert");
        }, 10000);
    }
}
