package ma.fst.enscantine.entities;


public class OrderRequest {
    public int menuId;
    public int quantity;

    public OrderRequest(int menuId, int quantity) {
        this.menuId = menuId;
        this.quantity = quantity;
    }
}
