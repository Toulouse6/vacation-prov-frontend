class VacationModel {

    public id: number;
    public destination: string;
    public description: string;
    public startDate: Date | string;
    public endDate: Date | string;
    public price: number;
    public imageUrl: string;
    public image?: File;
}

export default VacationModel;
