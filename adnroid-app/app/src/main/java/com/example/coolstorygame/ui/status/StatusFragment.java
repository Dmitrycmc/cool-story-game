package com.example.coolstorygame.ui.status;

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
import com.example.coolstorygame.databinding.FragmentStatusBinding;
import com.example.coolstorygame.schema.request.RequestStatus;
import com.example.coolstorygame.schema.response.Room;
import com.example.coolstorygame.schema.response.Status;
import com.example.coolstorygame.utils.Session;
import com.example.coolstorygame.utils.Timeout;

import java.util.StringJoiner;

public class StatusFragment extends Fragment {

    private StatusViewModel statusViewModel;
    private FragmentStatusBinding binding;

    Session session;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        statusViewModel =
                new ViewModelProvider(this).get(StatusViewModel.class);

        binding = FragmentStatusBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        session = new Session(getActivity());

        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);


        updateStatus();
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

                ((TextView) getActivity().findViewById(R.id.playerList)).setText(roomStatus.toString());
            });
            Timeout.setTimeout(this::updateStatus, 2000);
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