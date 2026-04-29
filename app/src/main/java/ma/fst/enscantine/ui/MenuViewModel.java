package ma.fst.enscantine.ui;

import android.app.Application;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

import ma.fst.enscantine.entities.Menu;
import ma.fst.enscantine.repository.MenuRepository;
import ma.fst.enscantine.session.SessionManager;

public class MenuViewModel extends AndroidViewModel {

    private MutableLiveData<List<Menu>> menus = new MutableLiveData<>();
    private MenuRepository repo;

    public MenuViewModel(Application app) {
        super(app);
        repo = new MenuRepository(new SessionManager(app));
    }

    public MutableLiveData<List<Menu>> getMenus() {
        return menus;
    }

    public void loadMenus() {
        repo.getTodayMenus(menus);
    }

    public MutableLiveData<String> createOrder(int userId, int menuId, int qty) {

        MutableLiveData<String> result = new MutableLiveData<>();

        List<Menu> currentMenus = menus.getValue();

        if (currentMenus == null) {
            result.setValue("Menus non chargés");
            return result;
        }

        for (Menu m : currentMenus) {
            if (m.id == menuId) {
                return repo.createOrder(userId, m, qty);
            }
        }

        result.setValue("Menu introuvable");
        return result;
    }


}