package com.example.coolstorygame.ui.room;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.fragment.NavHostFragment;

import com.example.coolstorygame.R;
import com.example.coolstorygame.api.RoomProvider;
import com.example.coolstorygame.databinding.FragmentRoomBinding;
import com.example.coolstorygame.schema.request.RequestCreate;
import com.example.coolstorygame.schema.request.RequestStatus;
import com.example.coolstorygame.schema.response.Room;
import com.example.coolstorygame.schema.response.Status;
import com.example.coolstorygame.utils.Session;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class RoomFragment extends Fragment {

    private RoomViewModel roomViewModel;
    private FragmentRoomBinding binding;

    private Session session;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        roomViewModel =
                new ViewModelProvider(this).get(RoomViewModel.class);

        binding = FragmentRoomBinding.inflate(inflater, container, false);

        View root = binding.getRoot();

        session = new Session(getActivity());
        session.clearAll();

        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.buttonCreateRoom.setOnClickListener(this::handleCreateRoom);
        binding.buttonRegister.setOnClickListener(this::handleEnterRoom);
    }

    private void handleCreateRoom(View v) {
        String body = new RequestCreate().toJson();

        RoomProvider.post("new", body, this::onReceiveRoom);
    }

    private void handleEnterRoom(View v) {
        String body = new RequestStatus().toJson();

        String roomId = binding.editTextRoomId.getText().toString();

        RoomProvider.post(roomId + "/status", body, this::onReceiveRoom);
    }

    public void onReceiveRoom(Integer code, String body) {
        if (code == 200) {
            Room room = Room.fromJson(body);

            if (room.token != null) {
                session.setString(Session.Field.roomToken, room.token);
            }
            session.setString(Session.Field.roomId, room.id);

            getActivity().runOnUiThread(() -> {
                ((BottomNavigationView)getActivity().findViewById(R.id.nav_view)).setVisibility(View.GONE);
                session.setString(Session.Field.status, Status.REGISTRATION.toString());
                NavHostFragment.findNavController(this).navigate(R.id.action_navigation_room_to_navigation_game);
            });
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(code).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}