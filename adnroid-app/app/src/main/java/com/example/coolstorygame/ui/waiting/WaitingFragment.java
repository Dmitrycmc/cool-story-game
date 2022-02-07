package com.example.coolstorygame.ui.waiting;

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
import com.example.coolstorygame.api.RoomProvider;
import com.example.coolstorygame.databinding.FragmentWaitingBinding;
import com.example.coolstorygame.schema.request.RequestStart;
import com.example.coolstorygame.ui.status.StatusFragment;
import com.example.coolstorygame.utils.Session;

public class WaitingFragment extends Fragment {

    private WaitingViewModel waitingViewModel;
    private FragmentWaitingBinding binding;

    private Session session;

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
            binding.buttonStart.setOnClickListener(this::handleStart);
            binding.buttonStart.setVisibility(View.VISIBLE);
        }
    }

    private void handleStart(View v) {
        String body = new RequestStart(session.getString(Session.Field.roomToken)).toJson();

        RoomProvider.post(session.getString(Session.Field.roomId) + "/start", body, this::onStart);
    }

    public void onStart(Integer code, String body) {
        if (code == 200) {
            StatusFragment.instance.updateStatus(body);
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