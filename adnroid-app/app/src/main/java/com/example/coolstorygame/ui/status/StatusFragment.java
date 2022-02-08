package com.example.coolstorygame.ui.status;

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
import com.example.coolstorygame.api.Provider;
import com.example.coolstorygame.databinding.FragmentStatusBinding;
import com.example.coolstorygame.schema.request.RequestStatus;
import com.example.coolstorygame.schema.response.Room;
import com.example.coolstorygame.schema.response.Status;
import com.example.coolstorygame.ui.questions.QuestionsFragment;
import com.example.coolstorygame.utils.Session;
import com.example.coolstorygame.utils.Timeout;

import java.util.StringJoiner;

public class StatusFragment extends Fragment {

    private StatusViewModel statusViewModel;
    private FragmentStatusBinding binding;

    private Session session;
    public static StatusFragment instance;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        statusViewModel =
                new ViewModelProvider(this).get(StatusViewModel.class);

        binding = FragmentStatusBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        session = new Session(getActivity());
        instance = this;

        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        statusPolling();
    }

    private void statusPolling() {
        String body = new RequestStatus(session.getString(Session.Field.playerId), session.getString(Session.Field.playerToken)).toJson();

        Provider.room(session.getString(Session.Field.roomId) + "/status", body, this::onResponse);
    }

    private void onResponse(Integer code, String body) {
        if (code == 200) {
            updateStatus(body);

            Timeout.setTimeout(this::statusPolling, 2000);
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(code).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }

    public void updateStatus(String body) {
        Room room = Room.fromJson(body);

        if (QuestionsFragment.instance != null) {
            session.setInt(Session.Field.currentPlayerNumber, room.currentPlayerNumber);
            session.setInt(Session.Field.currentQuestionNumber, room.currentQuestionNumber);
            QuestionsFragment.instance.update();
        }

        getActivity().runOnUiThread(() -> {
            StringJoiner roomStatus = new StringJoiner("\n", "", "");
            roomStatus.add("Статус: " + room.status);
            roomStatus.add("Игроки:");

            room.playerIds.forEach(roomStatus::add);
            ((TextView) getActivity().findViewById(R.id.playerList)).setText(roomStatus.toString());

            if (room.status == Status.GAME && session.getString(Session.Field.status).equals(Status.REGISTRATION.toString())) {
                session.setString(Session.Field.status, Status.GAME.toString());
                NavHostFragment.findNavController(this).navigate(R.id.action_navigation_waiting_to_navigation_questions);
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}