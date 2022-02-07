package com.example.coolstorygame.ui.waiting;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.coolstorygame.databinding.FragmentWaitingBinding;
import com.example.coolstorygame.utils.Session;

public class WaitingFragment extends Fragment {

    private WaitingViewModel waitingViewModel;
    private FragmentWaitingBinding binding;

    Session session;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        waitingViewModel =
                new ViewModelProvider(this).get(WaitingViewModel.class);

        binding = FragmentWaitingBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        session = new Session(getActivity());

        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (session.has(Session.Field.roomToken)) {
            binding.buttonStart.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}