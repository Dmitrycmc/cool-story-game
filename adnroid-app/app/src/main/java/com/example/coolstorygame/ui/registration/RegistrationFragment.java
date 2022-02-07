package com.example.coolstorygame.ui.registration;

import static androidx.core.content.ContextCompat.getSystemService;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.fragment.NavHostFragment;

import com.example.coolstorygame.R;
import com.example.coolstorygame.api.RoomProvider;
import com.example.coolstorygame.databinding.FragmentRegistrationBinding;
import com.example.coolstorygame.schema.request.RequestRegister;
import com.example.coolstorygame.schema.request.RequestStart;
import com.example.coolstorygame.schema.request.RequestStatus;
import com.example.coolstorygame.schema.response.Player;
import com.example.coolstorygame.schema.response.Room;
import com.example.coolstorygame.schema.response.Status;
import com.example.coolstorygame.utils.Session;
import com.example.coolstorygame.utils.Timeout;

import java.util.StringJoiner;

public class RegistrationFragment extends Fragment {

    private RegistrationViewModel registrationViewModel;
    private FragmentRegistrationBinding binding;

    private Session session;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        registrationViewModel =
                new ViewModelProvider(this).get(RegistrationViewModel.class);

        binding = FragmentRegistrationBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        session = new Session(getActivity());

        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        String roomId = session.getString(Session.Field.roomId);

        binding.editTextRoomId.setText(roomId);

        ClipboardManager clipboard = getSystemService(getContext(), ClipboardManager.class);
        ClipData clip = ClipData.newPlainText("23", session.getString(Session.Field.roomId));
        clipboard.setPrimaryClip(clip);

        //todo: show notification code in clipboard

        binding.buttonRegister.setOnClickListener(this::handleRegister);
        binding.buttonStart.setOnClickListener(this::handleStart);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();

        binding = null;
    }

    private void handleStart(View v) {
        String body = new RequestStart(session.getString(Session.Field.roomToken)).toJson();

        RoomProvider.post(session.getString(Session.Field.roomId) + "/start", body);
    }

    private void handleRegister(View v) {
        String roomId = session.getString(Session.Field.roomId);
        String name = binding.editTextPlayerName.getText().toString();
        String body = new RequestRegister(name).toJson();

        RoomProvider.post(roomId + "/register", body, this::onRegister);
    }

    public void onRegister(Integer code, String body) {
        if (code == 200) {
            Player player = Player.fromJson(body);

            session.setString(Session.Field.playerId,player.id);
            session.setString(Session.Field.playerToken, player.token);

            getActivity().runOnUiThread(() -> {
                NavHostFragment.findNavController(this).navigate(R.id.action_navigation_registration_to_navigation_questions);
            });

        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(code).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }
}