package ma.fst.enscantine.entities;

public class RegisterRequest {
    public String name;
    public String email;
    public String password;
    public String role;

    public RegisterRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = "student";
    }
}
