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

    public MenuViewModel(Application application) {
        super(application);

        SessionManager sessionManager = new SessionManager(application);
        repo = new MenuRepository(sessionManager);
    }

    public MutableLiveData<List<Menu>> getMenus() {
        return menus;
    }

    public void loadMenus() {
        repo.getTodayMenus(menus);
    }
}