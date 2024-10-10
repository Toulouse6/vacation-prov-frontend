class LikesModel {

    public readonly userId: number;
    public readonly vacationId: number;

    constructor(userId: number, vacationId: number) {
        this.userId = userId;
        this.vacationId = vacationId;
    }

}

export default LikesModel;
