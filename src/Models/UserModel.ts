class UserModel {

    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleId: number;
    public isAuthenticated: boolean;
    userRole: string;

    constructor(id: number, firstName: string, lastName: string, email: string, password: string, roleId: number, isAuthenticated: boolean) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roleId = roleId;
        this.isAuthenticated = isAuthenticated;
    }

}

export default UserModel;
