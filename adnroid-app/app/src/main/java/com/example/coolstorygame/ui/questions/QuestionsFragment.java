package com.example.coolstorygame.ui.questions;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.coolstorygame.R;
import com.example.coolstorygame.api.Provider;
import com.example.coolstorygame.databinding.FragmentQuestionsBinding;
import com.example.coolstorygame.schema.request.RequestAnswer;
import com.example.coolstorygame.schema.response.Room;
import com.example.coolstorygame.utils.Session;

public class QuestionsFragment extends Fragment {

    private QuestionsViewModel questionsViewModel;
    private FragmentQuestionsBinding binding;

    private Session session;
    public static QuestionsFragment instance;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        questionsViewModel =
                new ViewModelProvider(this).get(QuestionsViewModel.class);

        binding = FragmentQuestionsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        session = new Session(getActivity());
        instance = this;

        return root;
    }

    public void update() {
        Room room = session.getRoom();

        getActivity().runOnUiThread(() -> {
            if (room.players.get(room.currentPlayerNumber).id.equals(session.getString(Session.Field.playerId))) {
                binding.textQuestions.setVisibility(View.VISIBLE);
                binding.editTextAnswer.setVisibility(View.VISIBLE);
                binding.buttonAnswer.setVisibility(View.VISIBLE);

                binding.editTextAnswer.setHint(session.getQuestions().questions.get(room.currentQuestionNumber));

                binding.textQuestions.setText(
                    String.format("%s: %s?",
                        room.players.get(room.currentPlayerNumber).name,
                        session.getQuestions().questions.get(room.currentQuestionNumber)
                    )
                );
            } else {
                binding.textQuestions.setVisibility(View.GONE);
                binding.editTextAnswer.setVisibility(View.GONE);
                binding.buttonAnswer.setVisibility(View.GONE);
            }
        });
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.buttonAnswer.setOnClickListener(this::handleAnswer);

        update();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }


    private void handleAnswer(View v) {
        String roomId = session.getRoom().id;
        String playerId = session.getString(Session.Field.playerId);
        String playerToken = session.getString(Session.Field.playerToken);
        String answer = binding.editTextAnswer.getText().toString();

        String body = new RequestAnswer(playerId, playerToken, answer).toJson();

        Provider.room(roomId + "/answer", body, this::onRegister);
    }

    public void onRegister(Integer code, String body) {
        if (code == 200) {
            update();

            getActivity().runOnUiThread(() -> {
                binding.textQuestions.setVisibility(View.GONE);
                binding.editTextAnswer.setVisibility(View.GONE);
                binding.buttonAnswer.setVisibility(View.GONE);
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