import h5py

with open("/media/thisen-ekanayake/Machine-Learning1/Brain Tumor Detection & MRI Scan Analysis/archive/BraTS2020_training_data/content/data/volume_1_slice_0.h5", 'r') as f:
    print("Keys:", list(f.keys()))

    dataset = f["dataset_name"][:]
    print(dataset)