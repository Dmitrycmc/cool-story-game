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

        binding.button.setOnClickListener(v -> client.newCall(new Request.Builder()
                .url("https://cool-story-game.herokuapp.com/api/v1/room/61fe5794541daed60498478b/register")
                .post(RequestBody.create(MediaType.parse("application/json; charset=utf-8"), "{\"name\": \"Player\"}"))
                .build()
        ).enqueue(new Callback() {
            @Override
            public void onFailure(final Call call, IOException e) {
                getActivity().runOnUiThread(() -> {
                });
            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                String res = response.body().string();

                System.out.println(res);

                getActivity().runOnUiThread(() -> ((TextView)getActivity().findViewById(R.id.text_home)).setText(res));
            }
        }));

    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}