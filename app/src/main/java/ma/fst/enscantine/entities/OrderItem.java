package ma.fst.enscantine.entities;

public class OrderItem {

    public int menu_id;
    public String dish_name;
    public int quantity;
    public double subtotal;

    public OrderItem(int menu_id, int quantity, double subtotal) {
        this.menu_id = menu_id;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }
}