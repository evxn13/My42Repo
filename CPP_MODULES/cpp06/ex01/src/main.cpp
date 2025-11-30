#include "../include/Serializer.hpp"

int main(int argc, char** argv)
{
    (void)argv;
    if (argc != 1)
    {
        std::cerr << "Usage: " << argv[0] << std::endl;
        return 1;
    }
    Data original;
    original.value = 42;
    original.character = 'A';

    std::cout << "Original data: " << original.value << ", " << original.character << std::endl;

    uintptr_t serialized = Serializer::serialize(&original);
    Data* deserialized = Serializer::deserialize(serialized);

    std::cout << "Deserialized data: " << deserialized->value << ", " << deserialized->character << std::endl;

    if (&original == deserialized)
        std::cout << "Serialization and deserialization successful!" << std::endl;
    else
        std::cout << "Serialization and deserialization failed" << std::endl;

    return 0;
}