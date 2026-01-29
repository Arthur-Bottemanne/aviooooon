export class AlertController {
    constructor(planeManager, alertView) {
        this.planeManager = planeManager;
        this.alertView = alertView;

        this.init();
    }

    init() {
        this.planeManager.addEventListener("moonIntersection", (event) => {
            const planeData = event.detail;
            this.handleIntersection(planeData);
        });
    }

    handleIntersection(plane) {
        this.alertView.renderIntersectionAlert(plane);
    }
}
