package com.example.coolstorygame.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.coolstorygame.R;
import com.example.coolstorygame.databinding.FragmentHomeBinding;
import com.example.coolstorygame.schema.request.RegisterRequest;
import com.example.coolstorygame.schema.response.Player;

import java.io.IOException;

import okhttp3.*;

public class HomeFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private FragmentHomeBinding binding;

    OkHttpClient client = new OkHttpClient();

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        homeViewModel =
                new ViewModelProvider(this).get(HomeViewModel.class);

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textHome;
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

        binding.button.setOnClickListener(v -> {

            String roomId = binding.editTextTextRoom.getText().toString();
            String body = new RegisterRequest(binding.editTextTextPersonName.getText().toString()).toJson();

            client.newCall(new Request.Builder()
                    .url("https://cool-story-game.herokuapp.com/api/v1/room/" + roomId + "/register")
                    .post(RequestBody.create(MediaType.parse("application/json; charset=utf-8"), body))
                    .build()
            ).enqueue(new Callback() {
                @Override
                public void onFailure(final Call call, IOException e) {
                    getActivity().runOnUiThread(() -> {});
                }

                @Override
                public void onResponse(Call call, final Response response) throws IOException {
                    String body = response.body().string();

                    if (response.code() == 200) {

                        Player person = Player.fromJson(body);

                        getActivity().runOnUiThread(() -> ((TextView)getActivity().findViewById(R.id.text_home)).setText(person.toString()));
                    } else {
                        StringBuilder sb = new StringBuilder();
                        sb.append(response.code()).append(": ").append(body);

                        getActivity().runOnUiThread(() -> ((TextView)getActivity().findViewById(R.id.text_home)).setText(sb));
                    }
                }
            });
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}