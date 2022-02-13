package com.example.coolstorygame.ui.questions;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.coolstorygame.databinding.FragmentQuestionsBinding;
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

        binding.textQuestions.setText(
            String.format("%s (%s)",
                session.getQuestions().questions.get(room.currentQuestionNumber),
                room.players.get(room.currentPlayerNumber).name
            )
        );
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        update();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}