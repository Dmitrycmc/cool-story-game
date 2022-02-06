package com.example.coolstorygame.ui.home;

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
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.fragment.NavHostFragment;

import com.example.coolstorygame.R;
import com.example.coolstorygame.api.RoomProvider;
import com.example.coolstorygame.databinding.FragmentHomeBinding;
import com.example.coolstorygame.schema.request.RequestCreate;
import com.example.coolstorygame.schema.request.RequestRegister;
import com.example.coolstorygame.schema.request.RequestStart;
import com.example.coolstorygame.schema.request.RequestStatus;
import com.example.coolstorygame.schema.response.Player;
import com.example.coolstorygame.schema.response.Room;
import com.example.coolstorygame.schema.response.Status;
import com.example.coolstorygame.utils.Session;
import com.example.coolstorygame.utils.Timeout;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.StringJoiner;

public class HomeFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private FragmentHomeBinding binding;

    private Session session;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        homeViewModel =
                new ViewModelProvider(this).get(HomeViewModel.class);

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        session = new Session(getActivity());
        session.clearAll();

        final TextView textView = binding.textStatus;
        homeViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });
        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.buttonRegister.setOnClickListener(this::handleRegister);
        binding.buttonCreateRoom.setOnClickListener(this::handleCreateRoom);
        binding.buttonStart.setOnClickListener(this::handleStart);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();

        binding = null;
    }

    private void handleCreateRoom(View v) {
        String body = new RequestCreate().toJson();

        RoomProvider.post("new", body, this::onCreateRoom);
    }

    private void handleStart(View v) {
        String body = new RequestStart(session.getString(Session.Field.roomToken)).toJson();

        RoomProvider.post(session.getString(Session.Field.roomId) + "/start", body, this::onReceivedStatus);
    }

    public void onCreateRoom(Integer code, String body) {
        if (code == 200) {
            Room room = Room.fromJson(body);

            session.setString(Session.Field.roomToken, room.token);

            getActivity().runOnUiThread(() -> {
                ((FloatingActionButton) getActivity().findViewById(R.id.buttonCreateRoom)).setVisibility(View.INVISIBLE);
                ((TextView) getActivity().findViewById(R.id.editTextRoomId)).setText(room.id);
            });
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(code).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }

    private void handleRegister(View v) {
        String roomId = binding.editTextRoomId.getText().toString();
        String name = binding.editTextPlayerName.getText().toString();
        String body = new RequestRegister(name).toJson();

        RoomProvider.post(roomId + "/register", body, this::onRegister);
    }

    public void onRegister(Integer code, String body) {
        if (code == 200) {
            Player player = Player.fromJson(body);

            session.setString(Session.Field.playerId,player.id);
            session.setString(Session.Field.playerToken, player.token);
            session.setString(Session.Field.roomId, player.roomId);
            session.setString(Session.Field.status, Status.REGISTRATION.toString());

            updateStatus();
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(code).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }

    private void updateStatus() {
        String body = new RequestStatus(session.getString(Session.Field.playerId), session.getString(Session.Field.playerToken)).toJson();

        RoomProvider.post(session.getString(Session.Field.roomId) + "/status", body, this::onReceivedStatus);
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public void onReceivedStatus(Integer code, String body) {
        if (code == 200) {
            Room room = Room.fromJson(body);



            getActivity().runOnUiThread(() -> {
                StringJoiner roomStatus = new StringJoiner("\n", "", "");
                roomStatus.add("Статус: " + room.status);
                roomStatus.add("Игроки:");

                room.playerIds.forEach(roomStatus::add);

                if (session.getString(Session.Field.status).equals(Status.REGISTRATION.toString())) {
                    ((TextView) getActivity().findViewById(R.id.playerList)).setText(roomStatus.toString());

                    ((EditText) getActivity().findViewById(R.id.editTextRoomId)).setVisibility(View.GONE);
                    ((EditText) getActivity().findViewById(R.id.editTextPlayerName)).setVisibility(View.GONE);
                    ((Button) getActivity().findViewById(R.id.buttonRegister)).setVisibility(View.GONE);

                    if (session.has(Session.Field.roomToken)) {
                        ((Button) getActivity().findViewById(R.id.buttonStart)).setVisibility(View.VISIBLE);
                    }

                    if (room.status == Status.GAME) {
                        session.setString(Session.Field.status, Status.GAME.toString());
                        NavHostFragment.findNavController(this).navigate(R.id.action_navigation_home_to_navigation_game);
                    }
                }
            });
            if (session.getString(Session.Field.status).equals(Status.REGISTRATION.toString())) {
                Timeout.setTimeout(this::updateStatus, 2000);
            }
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(code).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }
}