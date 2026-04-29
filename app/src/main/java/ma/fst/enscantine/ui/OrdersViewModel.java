package ma.fst.enscantine.ui;

import android.app.Application;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

import ma.fst.enscantine.entities.Order;
import ma.fst.enscantine.repository.OrdersRepository;
import ma.fst.enscantine.session.SessionManager;

public class OrdersViewModel extends AndroidViewModel {

    private MutableLiveData<List<Order>> orders = new MutableLiveData<>();
    private OrdersRepository repo;

    public OrdersViewModel(Application app) {
        super(app);
        repo = new OrdersRepository(new SessionManager(app));
    }

    public MutableLiveData<List<Order>> getOrders() {
        return orders;
    }

    public void loadOrders() {
        repo.getOrders(orders);
    }

    public MutableLiveData<String> cancelOrder(int id) {
        return repo.updateStatus(id, "annulee");
    }
}